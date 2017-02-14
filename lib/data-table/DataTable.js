'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataTableBody = require('./data-table-body/DataTableBody');

var _DataTableBody2 = _interopRequireDefault(_DataTableBody);

var _Paginate = require('./paginate/Paginate');

var _Paginate2 = _interopRequireDefault(_Paginate);

var _DataTableHeader = require('./data-table-header/DataTableHeader');

var _DataTableHeader2 = _interopRequireDefault(_DataTableHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTable = function (_React$Component) {
  _inherits(DataTable, _React$Component);

  function DataTable(props) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, props));

    _this.keys = _react2.default.Children.map(props.children, function (child) {
      return child.props.dataKey;
    });
    return _this;
  }

  _createClass(DataTable, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          children = _props.children;


      return _react2.default.createElement(
        'div',
        { className: 'sv-table-responsive-vertical' },
        _react2.default.createElement(
          'table',
          { className: className },
          _react2.default.createElement(
            _DataTableHeader2.default,
            { onSort: this.props.onSort },
            this.props.children
          ),
          _react2.default.createElement(_DataTableBody2.default, { dataTableRows: this.props.data, dataTableHeader: this.keys })
        )
      );
    }
  }]);

  return DataTable;
}(_react2.default.Component);

DataTable.defaultProps = {
  className: 'sv-table with--hover with--borders'
};

DataTable.propTypes = {
  //String, class to add in DataTable
  className: _react2.default.PropTypes.string,

  //Array, the data to DataTable
  data: _react2.default.PropTypes.array.isRequired,

  //Callback function to exec when user makes sort in a column
  onSort: _react2.default.PropTypes.func
};

exports.default = DataTable;