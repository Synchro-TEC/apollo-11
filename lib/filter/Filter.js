'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FilterOptions = require('./FilterOptions');

var _FilterOptions2 = _interopRequireDefault(_FilterOptions);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Filter = function (_React$Component) {
  _inherits(Filter, _React$Component);

  function Filter(props) {
    _classCallCheck(this, Filter);

    var _this = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

    _this.addSearchValueToFilterValues = _this.addSearchValueToFilterValues.bind(_this);
    return _this;
  }

  /**
   * addSearchValueToFilterValues - description
   * Função executada pelo filho FilterOptions. Recebe o objeto com os valores do
   * filtro e adiciona o valor do campo de busca a este objeto.
   * @param  {type} filterValues description
   * @return {void}
   */


  _createClass(Filter, [{
    key: 'addSearchValueToFilterValues',
    value: function addSearchValueToFilterValues(filterValues) {
      debugger;
      var searchFieldValue = document.getElementsByName(this.props.name)[0].value;
      if (searchFieldValue !== '') {
        filterValues[this.props.name] = searchFieldValue;
      }
      this.props.onFilter(filterValues);
    }

    /**
     * doFilterBySearchField - description
     * Função executada quando o usuario usa o enter para realizar o filtro.
     * Se o filtro é um filtro com opções, uma função do filho FilterOptions é
     * chamada para recuperar os valores das opções, em seguida é chamada
     * a função doFilterByApplyFilter do pai para acrescentar a este objeto o valor
     * do campo de busca
     * @param  {type} e description
     * @return {void}
     */

  }, {
    key: 'doFilterBySearchField',
    value: function doFilterBySearchField(e) {
      if (e.keyCode === 13) {
        var isFilterWithOptions = this.refs.filterOptions.props.children;
        e.preventDefault();
        if (isFilterWithOptions) {
          this.refs.filterOptions.applyFilter();
        } else {
          this.props.onFilter(e.target.value);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          applyFilterButtonLabel = _props.applyFilterButtonLabel,
          cancelButtonLabel = _props.cancelButtonLabel,
          clearAllButtonLabel = _props.clearAllButtonLabel,
          filterButtonLabel = _props.filterButtonLabel,
          placeholder = _props.placeholder,
          name = _props.name,
          children = _props.children,
          onClearAll = _props.onClearAll,
          onFilter = _props.onFilter;


      return _react2.default.createElement(
        'form',
        { className: 'sv-form' },
        _react2.default.createElement(
          'div',
          { className: 'sv-input-group' },
          _react2.default.createElement(
            'span',
            { className: 'label at-first' },
            _react2.default.createElement('i', { className: 'fa fa-search fa-fw' })
          ),
          _react2.default.createElement('input', {
            className: 'on-center',
            name: name,
            onKeyDown: function onKeyDown(e) {
              _this2.doFilterBySearchField(e);
            },
            placeholder: placeholder,
            type: 'search'
          }),
          _react2.default.createElement(
            _FilterOptions2.default,
            {
              addSearchValueToFilterValues: this.addSearchValueToFilterValues,
              applyFilterButtonLabel: applyFilterButtonLabel,
              cancelButtonLabel: cancelButtonLabel,
              clearAllButtonLabel: clearAllButtonLabel,
              filterButtonLabel: filterButtonLabel,
              hasFilterOptions: !(0, _isUndefined3.default)(children),
              onClearAll: onClearAll,
              onFilter: onFilter,
              ref: 'filterOptions' },
            this.props.children
          )
        )
      );
    }
  }]);

  return Filter;
}(_react2.default.Component);

Filter.defaultProps = {
  placeholder: 'Buscar'
};

Filter.propTypes = {
  applyFilterButtonLabel: _react2.default.PropTypes.string,
  cancelButtonLabel: _react2.default.PropTypes.string,
  clearAllButtonLabel: _react2.default.PropTypes.string,
  filterButtonLabel: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onClearAll: _react2.default.PropTypes.func,
  onFilter: _react2.default.PropTypes.func,
  placeholder: _react2.default.PropTypes.string
};

Filter.displayName = 'Filter';

exports.default = Filter;