import React from 'react';
import MessageStack from './message-stack';

const Message = ({message}) => {

  let deleteButton = message.isDeletable ?
    <button onClick={() => MessageStack.removeMessage(message.id)}>&times;</button> :
    '';

  return (
    <li>
      {message.text}
      {deleteButton}
    </li>
  );
}

export default Message;