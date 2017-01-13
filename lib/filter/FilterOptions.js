'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _assign2 = require('lodash/assign');

var _assign3 = _interopRequireDefault(_assign2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by gnf on 11/01/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var FilterOptions = function (_React$Component) {
  _inherits(FilterOptions, _React$Component);

  function FilterOptions(props) {
    _classCallCheck(this, FilterOptions);

    var _this = _possibleConstructorReturn(this, (FilterOptions.__proto__ || Object.getPrototypeOf(FilterOptions)).call(this, props));

    _this.namesOfFields = [];
    _this.fields = [];
    _this.values = {};
    return _this;
  }

  _createClass(FilterOptions, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      for (var i = 0; i < this.namesOfFields.length; i++) {
        // Nomes iguais, nao podem ser colocados no formFields
        if (this.namesOfFields[i] !== this.namesOfFields[i + 1]) {
          //[].slice.call converte o NodeList para um array Javascript normal
          var formFields = [].slice.call(document.getElementsByName(this.namesOfFields[i]));
          formFields.map(function (formField) {
            return _this2.fields.push(formField);
          });
        }
      }
    }
  }, {
    key: 'onChangeMaster',
    value: function onChangeMaster() {
      var _this3 = this;

      this.fields.map(function (field) {
        if (field.type === 'select-one' && !(0, _isEmpty3.default)(field.value)) {
          _this3.values[field.name] = field.value;
        } else {
          if (field.type === 'radio' && field.checked) {
            _this3.values[field.name] = field.value;
          } else {
            if (field.type === 'checkbox' && field.checked) {
              if (_this3.values[field.name]) {
                _this3.values[field.name].push(field.value);
              } else {
                _this3.values[field.name] = [field.value];
              }
            }
          }
        }
      });
      this.props.onSearch(this.values);
      this.values = {};
    }
  }, {
    key: 'renderChildrenAndGetFieldNames',
    value: function renderChildrenAndGetFieldNames(children) {
      var _this4 = this;

      return _react2.default.Children.map(children, function (child) {
        if (Array.isArray(children)) {
          if (child.type === 'select') {
            _this4.namesOfFields.push(child.props.name);
          }
          if (typeof child !== 'string') {
            if (child.props.type === 'checkbox') {
              _this4.namesOfFields.push(child.props.name);
            }
            if (child.props.type === 'radio') {
              _this4.namesOfFields.push(child.props.name);
            }
            _this4.renderChildrenAndGetFieldNames(child.props.children);
          }
          return child;
        } else {
          if (!(0, _isEmpty3.default)(children.props)) {
            if (children.props.type === 'checkbox') {
              console.log(children.props.name);
            }
            if (children.props.type === 'radio') {
              _this4.namesOfFields(children.props.name);
            }
            _this4.renderChildrenAndGetFieldNames(child.props.children);
            return child;
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'section',
        { className: 'action-container' },
        _react2.default.createElement('div', { className: 'sv-triangle on-right' }),
        _react2.default.createElement(
          'section',
          { className: 'action-container--content' },
          this.renderChildrenAndGetFieldNames(this.props.children),
          _react2.default.createElement(
            'footer',
            null,
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-danger sv-pull-left' },
              ' Clear All '
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info sv-pull-right',
                onClick: function onClick(e) {
                  e.preventDefault();_this5.onChangeMaster();
                } },
              ' Apply Filter'
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-cancel sv-pull-right' },
              'Cancel'
            )
          )
        )
      );
    }
  }]);

  return FilterOptions;
}(_react2.default.Component);

FilterOptions.propTypes = {
  onSearch: _react2.default.PropTypes.func
};

FilterOptions.displayName = 'FilterOptions';

exports.default = FilterOptions;