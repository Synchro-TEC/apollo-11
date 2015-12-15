'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hermesApi = require('./hermes-api');

var _hermesApi2 = _interopRequireDefault(_hermesApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function Message(_ref) {
  var message = _ref.message;

  var deleteButton = message.isDeletable ? _react2.default.createElement(
    'button',
    { onClick: function onClick() {
        return _hermesApi2.default.removeMessage(message.id);
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