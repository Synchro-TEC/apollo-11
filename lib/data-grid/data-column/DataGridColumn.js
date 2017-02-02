'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataGridColumn = function (_React$Component) {
  _inherits(DataGridColumn, _React$Component);

  function DataGridColumn() {
    _classCallCheck(this, DataGridColumn);

    return _possibleConstructorReturn(this, (DataGridColumn.__proto__ || Object.getPrototypeOf(DataGridColumn)).apply(this, arguments));
  }

  _createClass(DataGridColumn, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          sortable = _props.sortable;

      var label = '';
      var sortIcon = '';

      if (!(0, _isUndefined3.default)(children)) {
        for (var i = 0; i < children.length; i++) {
          if (!(0, _isObject3.default)(children[i])) {
            if (children !== ' ') {
              label = children;
            }
          }
        }
      }

      if (sortable) {
        sortIcon = _react2.default.createElement('i', { className: 'fa fa-sort sv-sort' });
      }

      return _react2.default.createElement(
        'th',
        null,
        sortIcon,
        label
      );
    }
  }]);

  return DataGridColumn;
}(_react2.default.Component);

exports.default = DataGridColumn;