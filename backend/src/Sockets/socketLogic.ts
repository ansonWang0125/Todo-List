import { Server, Socket } from 'socket.io';
import leaveRoom from '../utils/leave-room';
import { addComment, searchComment } from '../Controllers/commentController';
import db from "../Model";
const User = db.users;
import { UserInstance } from "../Model/types";

interface ChatRoomUser {
    id: string;
    username: string;
    taskID: string;
  }

export function configureSocket(io: Server) {

    // const CHAT_BOT = 'ChatBot';
    // let chatRoom = ''; // E.g. javascript, node,...
    let allUsers: ChatRoomUser[] = []; // All users in current chat room

  io.on('connection', (socket: Socket) => {
    console.log(`User connected ${socket.id}`);

    // Add a user to a room
    socket.on('join_comment', async (data) => {
      // console.log(data)
      const { username, taskID } = data; // Data sent from client when join_room event emitted
      socket.join(taskID); // Join the user to a socket room

      // let createdtime = Date.now(); // Current timestamp
      // // Send message to all users currently in the room, apart from the user that just joined
      // socket.to(id).emit('receive_comment', {
      //   message: `${username} has joined the chat room`,
      //   username: CHAT_BOT,
      //   createdtime,
      // });
      // socket.emit('receive_comment', {
      //   message: `Welcome ${username}`,
      //   username: CHAT_BOT,
      //   createdtime,
      // });;
      allUsers.push({ id: socket.id, username, taskID });
      let chatRoomUsers = allUsers.filter((user) => user.taskID === taskID);
      socket.to(taskID).emit('comment_users', chatRoomUsers);
      socket.emit('comment_users', chatRoomUsers);
      console.log('taskid:', taskID)
      const rows = await searchComment(taskID)
      console.log(rows)
      socket.emit('last_comments', rows);
    });

    socket.on('send_comment', async(data) => {
      console.log(data)
      const { username, comment, createdtime, taskID } = data;
      io.in(taskID).emit('receive_comment', data); // Send to all users in room, including sender
      const user: UserInstance | null = await User.findOne({
          where: {
              userName: username
          }
      });
      console.log(comment);
      addComment(comment, createdtime, user.id, taskID)
    //   harperSaveMessage(message, username, room, createdtime) // Save message in db
    //     .then((response) => console.log(response))
    //     .catch((err) => console.log(err));
    // 
    });

    
    socket.on('complete_task', async(data) => {
      console.log(data)
      const { username, taskID } = data;
      io.in(taskID).emit('receive_comment', data); // Send to all users in room, including sender
      const user: UserInstance | null = await User.findOne({
          where: {
              userName: username
          }
      });
      const today = new Date ()
      addComment(`${username} complete the task!`, today.toLocaleString(), user.id, taskID)
    //   harperSaveMessage(message, username, room, createdtime) // Save message in db
    //     .then((response) => console.log(response))
    //     .catch((err) => console.log(err));
    // 
    });

    socket.on('leave_comment', (data) => {
      const { username, taskID } = data;
      console.log("leave id",taskID)
      socket.leave(taskID);
      // const createdtime = Date.now();
      // Remove user from memory
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(taskID).emit('comment_users', allUsers);
      // socket.to(taskID).emit('receive_comment', {
      //   username: CHAT_BOT,
      //   message: `${username} has left the chat`,
      //   createdtime,
      // });
      console.log(`${username} has left the room`);
    });

    socket.on('get_room_members', (data) => {
      const { taskID } = data;
      console.log(' get id = ', taskID)
      const members = io.sockets.adapter.rooms.get(taskID);
  
      if (members) {
        const memberIds = Array.from(members);
        console.log('Members in room:', memberIds);
      } else {
        console.log('Room does not exist or has no members');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from the chat');
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
      }
    });
  });
}
