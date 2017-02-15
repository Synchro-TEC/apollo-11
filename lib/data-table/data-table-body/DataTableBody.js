'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataTableCell = require('./DataTableCell');

var _DataTableCell2 = _interopRequireDefault(_DataTableCell);

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTableBody = function (_React$Component) {
  _inherits(DataTableBody, _React$Component);

  function DataTableBody() {
    _classCallCheck(this, DataTableBody);

    return _possibleConstructorReturn(this, (DataTableBody.__proto__ || Object.getPrototypeOf(DataTableBody)).apply(this, arguments));
  }

  _createClass(DataTableBody, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rows = this.props.dataTableRows.map(function (dataTableRow) {
        var cells = _this2.props.dataTableHeader.map(function (dataTableHeaderKey) {
          return _react2.default.createElement(_DataTableCell2.default, { key: (0, _uniqueId3.default)('cell_'), valueOfCell: dataTableRow[dataTableHeaderKey] });
        });
        return _react2.default.createElement(
          'tr',
          { key: (0, _uniqueId3.default)('row_') },
          cells
        );
      });

      return _react2.default.createElement(
        'tbody',
        null,
        rows
      );
    }
  }]);

  return DataTableBody;
}(_react2.default.Component);

DataTableBody.propTypes = {
  dataTableRows: _react2.default.PropTypes.array.isRequired,
  dataTableHeader: _react2.default.PropTypes.array.isRequired
};

exports.default = DataTableBody;