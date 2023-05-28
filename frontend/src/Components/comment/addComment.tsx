import './css/comment.css';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../Context/UserCtx';
import { Mention, MentionsInput } from 'react-mentions';
import mentionStyle from './mentionStyle';
import mentionsInputStyle from './mentionInputStyle';
import { useLoginContext } from '../../Context/LoginCtx';
import { apiGetUser } from '../../axios/api';

interface SendMessageProps {
  socket: any;
  id: number|undefined;
}

interface MentionData {
  id: number;
  display: string;
}

async function GetAllUser() {
  try {
    const response = await apiGetUser();
    if (response.status === 200) {
      const responseData = response.data;
      console.log('success');
      console.log('response = ', responseData);
      return responseData;
    }
  } catch (reason: any){ 
      let response = reason.response
      console.log(response)
  }
}

const SendMessage: React.FC<SendMessageProps> = ({ socket, id }) => {
  const { user } = useUserContext();
  const { login } = useLoginContext();
  const [formState, setFormState] = useState({
    username: '',
    comment: '',
  });
  const [ users, setUsers ] = useState<MentionData []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllUser();
      console.log('mention', response.users)
      setUsers(response.users)
    }
    fetchData();
  }, [])

  const clickSendMessage = () => {
    if (formState.comment !== '') {
      const createdtime = new Date();
      socket.emit('send_comment', {
        username: user,
        comment: formState.comment,
        createdtime,
        taskID: id?.toString(),
      });
      setFormState({ ...formState, comment: '' });
    }
  };

  return (
      <div className="sendCommentContainer">
        <div id="comment-input">
          <MentionsInput
            // placeholder="Add Comment. Use '@' for mention and '&' for emojis"
            value={formState.comment}
            onChange={(e) =>
              setFormState({ ...formState, comment: e.target.value })
            }
            style={mentionsInputStyle}
          >
            <Mention trigger="@" style={mentionStyle} data={users} />
          </MentionsInput>
        </div>
        <div id="comment-send">
          <button className="btn btn-primary" disabled={!login}onClick={clickSendMessage}>
            Add Comment
          </button>
        </div>
      </div>
  );
};

export default SendMessage;
