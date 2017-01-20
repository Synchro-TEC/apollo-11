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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by gnf on 11/01/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Filter = function (_React$Component) {
  _inherits(Filter, _React$Component);

  function Filter(props) {
    _classCallCheck(this, Filter);

    return _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));
  }

  /**
   * Adiciona o value do campo de busca ao objeto e retorna o objeto modificado
   * @param filterOptionValues
   * @returns {*}
   */


  _createClass(Filter, [{
    key: 'addSearchValue',
    value: function addSearchValue(filterOptionValues) {
      var inputElement = document.getElementById('query');
      var nameOfField = inputElement.name;
      if (filterOptionValues === null) {
        var value = {};
        value[nameOfField] = inputElement.value;
        return value;
      } else {
        filterOptionValues[nameOfField] = inputElement.value;
        return filterOptionValues;
      }
    }
  }, {
    key: '_onSearch',
    value: function _onSearch(filterOptionValues) {
      if (this.props.onSearch) {
        this.props.onSearch(this.addSearchValue(filterOptionValues));
      }
    }
  }, {
    key: '_searchWhenKeyDown',
    value: function _searchWhenKeyDown(e) {
      if (this.props.onSearch && e.target.keyCode === 13) {
        this.props.onSearch(this.addSearchValue(null));
      }
    }
  }, {
    key: 'toggleVisibilityOfFilterOptions',
    value: function toggleVisibilityOfFilterOptions() {
      this.refs.filterOptions.toggleVisibility();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          placeholder = _props.placeholder,
          name = _props.name,
          children = _props.children;


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
          _react2.default.createElement('input', { className: 'on-center',
            id: 'query',
            name: name,
            onKeyDown: function onKeyDown(e) {
              return _this2._searchWhenKeyDown(e);
            },
            placeholder: placeholder,
            type: 'search' }),
          _react2.default.createElement(
            _FilterOptions2.default,
            { hasFilterOptions: !(0, _isUndefined3.default)(children),
              onSearch: function onSearch(filterOptionValues) {
                return _this2._onSearch(filterOptionValues);
              }, ref: 'filterOptions' },
            this.props.children
          )
        )
      );
    }
  }]);

  return Filter;
}(_react2.default.Component);

Filter.defaultProps = {
  placeholder: 'Type to search!',
  name: 'searchValue'
};

Filter.propTypes = {
  name: _react2.default.PropTypes.string,
  onSearch: _react2.default.PropTypes.func,
  placeholder: _react2.default.PropTypes.string
};

Filter.displayName = 'Filter';

exports.default = Filter;