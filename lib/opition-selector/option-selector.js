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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var optionSelectorStyles = {
  container: {
    display: 'inline',
    position: 'relative'
  },
  options: {
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 5px #d1d1d1',
    display: 'none',
    position: 'absolute',
    listStyle: 'none',
    zIndex: '99'
  },
  li: {
    display: 'block',
    cursor: 'pointer',
    margin: '10px 0',
    lineHeight: '1.5'
  }
};

var OptionSelector = function (_React$Component) {
  _inherits(OptionSelector, _React$Component);

  function OptionSelector(props) {
    _classCallCheck(this, OptionSelector);

    var _this = _possibleConstructorReturn(this, (OptionSelector.__proto__ || Object.getPrototypeOf(OptionSelector)).call(this, props));

    _this.state = { label: _this.props.initialValue, isVisible: false };
    return _this;
  }

  _createClass(OptionSelector, [{
    key: 'onSelect',
    value: function onSelect(opt) {
      this.setState({ label: opt[this.props.labelKey], isVisible: false });
      if (this.props.onSelectCallBack) {
        this.props.onSelectCallBack(opt);
      }
    }
  }, {
    key: 'showOptions',
    value: function showOptions() {
      this.setState({ label: this.state.label, isVisible: !this.state.isVisible });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var options = this.props.options.map(function (opt, i) {
        return _react2.default.createElement(
          'li',
          { key: 'opt-' + i, onClick: function onClick() {
              return _this2.onSelect(opt);
            }, style: optionSelectorStyles.li },
          opt[_this2.props.labelKey]
        );
      });
      var display = this.state.isVisible ? { display: 'block' } : { display: 'none' };
      var optsStyles = Object.assign({}, optionSelectorStyles.options, display);
      var classes = this.props.classes || 'sv-button link link-info';
      return _react2.default.createElement(
        'div',
        { style: optionSelectorStyles.container },
        _react2.default.createElement(
          'button',
          { className: classes, onClick: function onClick() {
              return _this2.showOptions();
            } },
          this.state.label
        ),
        _react2.default.createElement(
          'ul',
          { style: optsStyles },
          options
        )
      );
    }
  }]);

  return OptionSelector;
}(_react2.default.Component);

OptionSelector.displayName = 'OptionSelector';

OptionSelector.propTypes = {
  classes: _react2.default.PropTypes.string,
  initialValue: _react2.default.PropTypes.string,
  labelKey: _react2.default.PropTypes.string,
  onSelectCallBack: _react2.default.PropTypes.func,
  options: _react2.default.PropTypes.array.isRequired
};

OptionSelector.defaultProps = {
  initialValue: '?'
};

exports.default = OptionSelector;