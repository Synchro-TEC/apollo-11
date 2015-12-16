import React from 'react';
import HermesAPI from './hermes-api';
import HermesStyles from './hermes-styles';

const Message = ({message}) => {

  let deleteButton = message.isDeletable ?
    <button onClick={() => HermesAPI.removeMessage(message.id)} style={HermesStyles.closeButtonMessage}>&times;</button> :
    '';

  return (
    <li style={HermesStyles.msgStyle}>
      {deleteButton}
      {message.text}
    </li>
  );
};

Message.displayName = 'Message';

export default Message;
