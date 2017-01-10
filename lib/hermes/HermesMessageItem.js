'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HermesApi = require('./HermesApi');

var _HermesApi2 = _interopRequireDefault(_HermesApi);

var _HermesStyles = require('./HermesStyles');

var _HermesStyles2 = _interopRequireDefault(_HermesStyles);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HermesMessageItem = function HermesMessageItem(_ref) {
  var message = _ref.message;


  var classButtonMap = {
    info: 'link-info',
    error: 'link-danger',
    success: 'link-primary',
    warning: 'link-warning'
  };

  var classes = (0, _classnames2.default)('sv-button link', classButtonMap[_HermesApi2.default.context]);

  var deleteButton = message.isDeletable ? _react2.default.createElement(
    'button',
    { className: classes, onClick: function onClick() {
        return _HermesApi2.default.removeMessage(message.id);
      } },
    '\xD7'
  ) : '';

  return _react2.default.createElement(
    'li',
    { style: _HermesStyles2.default.msgStyle },
    deleteButton,
    message.text
  );
};

HermesMessageItem.displayName = 'HermesMessageItem';

exports.default = HermesMessageItem;