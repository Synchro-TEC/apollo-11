'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

    return _possibleConstructorReturn(this, (FilterOptions.__proto__ || Object.getPrototypeOf(FilterOptions)).call(this, props));
  }

  _createClass(FilterOptions, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      debugger;
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(children) {
      var _this2 = this;

      return _react2.default.Children.map(children, function (child) {
        if (Array.isArray(children)) {
          if (child.type === 'select') {
            console.log(child.props.name);
          }
          if (typeof child !== 'string') {
            if (child.props.type === 'checkbox') {
              console.log(child.props.value);
            }
            _this2.renderChildren(child.props.children);
          }
          return child;
        } else {
          if (children.props) {
            if (children.props.type === 'checkbox') {
              console.log(children.props.value);
            }
            if (children.props.children) {
              if (child.type === 'select') {
                console.log(child.props.name);
              }
              _this2.renderChildren(child.props.children);
              return child;
            }
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'section',
        { className: 'action-container' },
        _react2.default.createElement('div', { className: 'sv-triangle on-right' }),
        _react2.default.createElement(
          'section',
          { className: 'action-container--content' },
          this.renderChildren(this.props.children),
          _react2.default.createElement(
            'footer',
            null,
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-danger sv-pull-left' },
              'Clear All'
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info sv-pull-right' },
              'Apply Filter'
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

FilterOptions.displayName = 'FilterOptions';

exports.default = FilterOptions;