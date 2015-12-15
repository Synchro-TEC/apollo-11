'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hermesApi = require('./hermes-api');

var _hermesApi2 = _interopRequireDefault(_hermesApi);

var _hermesStyles = require('./hermes-styles');

var _hermesStyles2 = _interopRequireDefault(_hermesStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function Message(_ref) {
  var message = _ref.message;

  var deleteButton = message.isDeletable ? _react2.default.createElement(
    'button',
    { style: _hermesStyles2.default.closeButtonMessage, onClick: function onClick() {
        return _hermesApi2.default.removeMessage(message.id);
      } },
    '×'
  ) : '';

  return _react2.default.createElement(
    'li',
    null,
    deleteButton,
    message.text
  );
};

exports.default = Message;