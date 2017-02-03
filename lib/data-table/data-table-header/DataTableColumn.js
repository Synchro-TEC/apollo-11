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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTableColumn = function (_React$Component) {
  _inherits(DataTableColumn, _React$Component);

  function DataTableColumn(props) {
    _classCallCheck(this, DataTableColumn);

    var _this = _possibleConstructorReturn(this, (DataTableColumn.__proto__ || Object.getPrototypeOf(DataTableColumn)).call(this, props));

    _this.state = { direction: '' };
    return _this;
  }

  _createClass(DataTableColumn, [{
    key: 'onSort',
    value: function onSort() {
      var _this2 = this;

      var executeSort = function executeSort() {
        _this2.props.onSort(_this2.props.dataKey, _this2.state.direction);
      };
      if (this.state.direction === 'desc' || this.state.direction === '') {
        this.setState({ direction: 'asc' }, executeSort);
      } else {
        this.setState({ direction: 'desc' }, executeSort);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          children = _props.children,
          sortable = _props.sortable;

      var dataColumnLabel = '';
      var directionOfSortClassName = void 0;
      var sortIcon = '';

      if (this.state.direction === 'asc') {
        directionOfSortClassName = 'fa fa-sort-asc sv-sort is--active';
      } else if (this.state.direction === 'desc') {
        directionOfSortClassName = 'fa fa-sort-desc sv-sort is--active';
      } else {
        directionOfSortClassName = 'fa fa-sort sv-sort';
      }

      if (!(0, _isUndefined3.default)(children)) {
        for (var i = 0; i < children.length; i++) {
          if (!(0, _isObject3.default)(children[i])) {
            dataColumnLabel = children;
          }
        }
      }

      if (sortable) {
        sortIcon = _react2.default.createElement('i', { onClick: function onClick() {
            return _this3.onSort();
          }, className: directionOfSortClassName });
      }

      return _react2.default.createElement(
        'th',
        null,
        sortIcon,
        dataColumnLabel
      );
    }
  }]);

  return DataTableColumn;
}(_react2.default.Component);

DataTableColumn.propTypes = {
  dataKey: _react2.default.PropTypes.string.isRequired,
  sortable: _react2.default.PropTypes.bool
};

exports.default = DataTableColumn;