import React from 'react';
import HermesAPI from './hermes-api';
import HermesStyles from './hermes-styles';

const Message = ({message}) => {

  let deleteButton = message.isDeletable ?
    <button style={HermesStyles.closeButtonMessage} onClick={() => HermesAPI.removeMessage(message.id)}>&times;</button> :
    '';

  return (
    <li style={HermesStyles.msgStyle}>
      {deleteButton}
      {message.text}
    </li>
  );
};

export default Message;