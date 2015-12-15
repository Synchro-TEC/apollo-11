'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _messageStack = require('./message-stack');

var _messageStack2 = _interopRequireDefault(_messageStack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function Message(_ref) {
  var message = _ref.message;

  var deleteButton = message.isDeletable ? _react2.default.createElement(
    'button',
    { onClick: function onClick() {
        return _messageStack2.default.removeMessage(message.id);
      } },
    '×'
  ) : '';

  return _react2.default.createElement(
    'li',
    null,
    message.text,
    deleteButton
  );
};

exports.default = Message;