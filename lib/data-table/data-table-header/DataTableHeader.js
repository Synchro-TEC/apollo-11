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

    return _possibleConstructorReturn(this, (DataTableHeader.__proto__ || Object.getPrototypeOf(DataTableHeader)).call(this, props));
  }

  /**
   * renderWithProps - description
   * Renderiza os filhos do DataTableHeader, que são DataTableColumns
   * configurados pelo usuário, recuperando a função onSort recebida como prop
   * para que cada filho possa executá-la, essa propriedade (onSort) é uma exposição da
   * função onSort do componente DataTable
   * @return {object}
   */


  _createClass(DataTableHeader, [{
    key: 'renderWithProps',
    value: function renderWithProps() {
      var _this2 = this;

      if (Array.isArray(this.props.children)) {
        return this.props.children.map(function (child, i) {
          var clone = _react2.default.cloneElement(child, { onSort: _this2.props.onSort, key: 'headerCell-' + i });
          return clone;
        });
      } else {
        return _react2.default.cloneElement(this.props.children, { onSort: this.props.onSort, key: (0, _uniqueId3.default)('headerCell-') });
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