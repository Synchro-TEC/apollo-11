'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resizer = function Resizer(_ref) {
  var _onMouseDown = _ref.onMouseDown,
      split = _ref.split;

  var classes = ['Resizer', split];

  return _react2.default.createElement('span', { className: classes.join(' '), onMouseDown: function onMouseDown(e) {
      return _onMouseDown(e);
    } });
};

Resizer.displayName = 'Resizer';

exports.default = Resizer;