import React from 'react';
import HermesAPI from './hermes-api';

const Message = ({message}) => {

  let deleteButton = message.isDeletable ?
    <button onClick={() => HermesAPI.removeMessage(message.id)}>&times;</button> :
    '';

  return (
    <li>
      {message.text}
      {deleteButton}
    </li>
  );
};

export default Message;