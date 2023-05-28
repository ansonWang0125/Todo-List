import './css/comment.css';
import { useState, useEffect, useRef } from 'react';

interface Comment {
  comment: string;
  username: string;
  createdtime: number;
}

interface CommentsProps {
  socket: any;
}

const Comments: React.FC<CommentsProps> = ({ socket }) => {
  const [commentsReceived, setCommentsReceived] = useState<Comment[]>([]);
  const commentsColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const receiveCommentHandler = (data: Comment) => {
      console.log("data", data);
      setCommentsReceived((state) => [
        ...state,
        {
          comment: data.comment,
          username: data.username,
          createdtime: data.createdtime,
        },
      ]);
    };

    socket.on('receive_comment', receiveCommentHandler);

    return () => {
      socket.off('receive_comment', receiveCommentHandler);
    };
  }, [socket]);

  useEffect(() => {
    // Last 20 comments sent in the chat room (fetched from the db in backend)
    socket.on('last_comments', (rows: Comment []) => {
      console.log('Last comments:', rows);
      const Comments: Comment[] = rows;
      // Sort these comments by __createdtime__
      const sortedComments = sortCommentsByDate(Comments);
      setCommentsReceived((state) => [...sortedComments, ...state]);
    });

    return () => {
      socket.off('last_comments');
    };
  }, [socket]);

  function formatDateFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  useEffect(() => {
    if (commentsColumnRef.current) {
      commentsColumnRef.current.scrollTop =
        commentsColumnRef.current.scrollHeight;
    }
  }, [commentsReceived]);

  function sortCommentsByDate(comments: Comment[]): Comment[] {
    return comments.sort((a, b) => a.createdtime - b.createdtime);
  }

  return (
    <div className="commentsColumn" ref={commentsColumnRef}>
      {commentsReceived.map((msg, i) => (
        <div className="comment" key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="msgMeta">{msg.username}</span>
            <span className="msgMeta">
              {formatDateFromTimestamp(msg.createdtime)}
            </span>
          </div>
          <p className="msgText">{msg.comment}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Comments;
