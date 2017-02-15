'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTableHeader = function (_React$Component) {
  _inherits(DataTableHeader, _React$Component);

  function DataTableHeader(props) {
    _classCallCheck(this, DataTableHeader);

    var _this = _possibleConstructorReturn(this, (DataTableHeader.__proto__ || Object.getPrototypeOf(DataTableHeader)).call(this, props));

    _this.state = { beingSorted: { columnKey: '', direction: '' } };
    _this.setSortColumn = _this.setSortColumn.bind(_this);
    _this.renderWithProps = _this.renderWithProps.bind(_this);
    return _this;
  }

  _createClass(DataTableHeader, [{
    key: 'setSortColumn',
    value: function setSortColumn(dataKey) {
      var _this2 = this;

      var newState = { columnKey: dataKey, direction: '' };

      if (this.state.beingSorted.columnKey === '' || this.state.beingSorted.columnKey !== dataKey) {
        newState.direction = 'asc';
      } else if (this.state.beingSorted.columnKey === dataKey) {
        if (this.state.beingSorted.direction === 'asc') {
          newState.direction = 'desc';
        } else {
          newState.direction = 'asc';
        }
      }

      this.setState({ beingSorted: newState }, function () {
        if (_this2.props.onSort) {
          _this2.props.onSort(_this2.state.beingSorted);
        } else {
          console.warn('When a column is sortable you need to pass a callback function to DataTable component.');
        }
      });
    }

    /**
     * renderWithProps - description
     * Renderiza os filhos do DataTableHeader, que são DataTableColumns
     * configurados pelo usuário, recuperando a função onSort recebida como prop
     * para que cada filho possa executá-la, essa propriedade (onSort) é uma exposição da
     * função onSort do componente DataTable
     * @return {object}
     */

  }, {
    key: 'renderWithProps',
    value: function renderWithProps() {
      var _this3 = this;

      if (Array.isArray(this.props.children)) {
        return this.props.children.map(function (child, i) {
          if (child.props.dataKey === _this3.state.beingSorted.columnKey) {
            return _react2.default.cloneElement(child, { onSort: _this3.props.onSort,
              key: 'headerCell-' + i,
              setSortColumn: _this3.setSortColumn,
              direction: _this3.state.beingSorted.direction });
          } else {
            return _react2.default.cloneElement(child, { onSort: _this3.props.onSort,
              key: 'headerCell-' + i,
              setSortColumn: _this3.setSortColumn });
          }
        });
      } else {
        return _react2.default.cloneElement(this.props.children, { onSort: this.props.onSort,
          key: (0, _uniqueId3.default)('headerCell-'),
          setSortColumn: this.setSortColumn,
          direction: this.state.beingSorted.direction });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          this.renderWithProps()
        )
      );
    }
  }]);

  return DataTableHeader;
}(_react2.default.Component);

exports.default = DataTableHeader;