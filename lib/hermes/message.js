import React from 'react';
import HermesAPI from './hermes-api';
import HermesStyles from './hermes-styles';

var Message = function Message(_ref) {
  var message = _ref.message;

  var deleteButton = message.isDeletable ? React.createElement(
    'button',
    { onClick: function onClick() {
        return HermesAPI.removeMessage(message.id);
      }, style: HermesStyles.closeButtonMessage },
    '×'
  ) : '';

  return React.createElement(
    'li',
    { style: HermesStyles.msgStyle },
    deleteButton,
    message.text
  );
};

Message.displayName = 'Message';

export default Message;