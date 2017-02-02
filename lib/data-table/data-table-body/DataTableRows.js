'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataTableCell = require('./DataTableCell');

var _DataTableCell2 = _interopRequireDefault(_DataTableCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTableRows = function (_React$Component) {
  _inherits(DataTableRows, _React$Component);

  function DataTableRows() {
    _classCallCheck(this, DataTableRows);

    return _possibleConstructorReturn(this, (DataTableRows.__proto__ || Object.getPrototypeOf(DataTableRows)).apply(this, arguments));
  }

  _createClass(DataTableRows, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rows = this.props.dataTableRows.map(function (dataTableRow, i) {
        var cells = _this2.props.dataTableHeader.map(function (dataTableHeaderKey, j) {
          return _react2.default.createElement(_DataTableCell2.default, { key: j, valueOfCell: dataTableRow[dataTableHeaderKey] });
        });
        return _react2.default.createElement(
          'tr',
          null,
          cells
        );
      });

      debugger;

      return _react2.default.createElement(
        'tbody',
        null,
        rows
      );
    }
  }]);

  return DataTableRows;
}(_react2.default.Component);

DataTableRows.propTypes = {
  dataTableRows: _react2.default.PropTypes.array.isRequired,
  dataTableHeader: _react2.default.PropTypes.array.isRequired
};

exports.default = DataTableRows;