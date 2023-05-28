interface ChatRoomUser {
    id: string;
    username: string;
    taskID: string;
}

export default function leaveRoom(userID: string, chatRoomUsers: ChatRoomUser[]): ChatRoomUser[] {
    // console.log('id === ', userID)
    return chatRoomUsers.filter((user) => user.id !== userID);
}