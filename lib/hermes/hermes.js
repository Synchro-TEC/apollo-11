'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _messageStack = require('./message-stack');

var _messageStack2 = _interopRequireDefault(_messageStack);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _hermesStyles = require('./hermes-styles');

var _hermesStyles2 = _interopRequireDefault(_hermesStyles);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hermes = (function (_React$Component) {
  _inherits(Hermes, _React$Component);

  function Hermes(props) {
    _classCallCheck(this, Hermes);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Hermes).call(this, props));

    _this.state = {
      autoClose: _this.props.autoClose,
      autoCloseInMiliseconds: _this.props.autoCloseInMiliseconds,
      context: _this.props.context,
      messages: [],
      title: _this.props.title,
      visible: false
    };

    _this.timeOut = undefined;
    _this.onStackChange = _this.onStackChange.bind(_this);
    return _this;
  }

  _createClass(Hermes, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _messageStack2.default.addChangeListener(this.onStackChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _messageStack2.default.removeChangeListener(this.onStackChange);
    }
  }, {
    key: 'onStackChange',
    value: function onStackChange() {
      var _this2 = this;

      var newState = (0, _reactAddonsUpdate2.default)(this.state, {
        context: { $set: _messageStack2.default.context || this.props.context },
        messages: { $set: _messageStack2.default.stack },
        title: { $set: _messageStack2.default.title || this.props.title },
        visible: { $set: _messageStack2.default.stack.length }
      });

      this.setState(newState);

      this.timeOut = setTimeout(function () {
        if (_this2.state.autoClose && _this2.state.visible) {
          _this2.hide();
        }
      }, this.state.autoCloseInMiliseconds);
    }
  }, {
    key: 'hide',
    value: function hide() {
      var newState = (0, _reactAddonsUpdate2.default)(this.state, {
        visible: { $set: false }
      });
      this.setState(newState);

      clearTimeout(this.timeOut);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var createMessage = function createMessage(message) {
        return _react2.default.createElement(_message2.default, { key: message.id, message: message });
      };

      var visible = this.state.visible ? 'block' : 'none';

      var display = { display: visible };
      var styles = Object.assign(display, _hermesStyles2.default[this.state.context]);

      return _react2.default.createElement(
        'div',
        { style: styles },
        _react2.default.createElement(
          'h3',
          null,
          this.state.title || 'Messages:',
          _react2.default.createElement(
            'button',
            { onClick: function onClick() {
                return _this3.hide();
              } },
            '×'
          )
        ),
        _react2.default.createElement(
          'ul',
          null,
          this.state.messages.map(createMessage)
        )
      );
    }
  }], [{
    key: 'addMessage',
    value: function addMessage(msg) {
      var isDeletable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      _messageStack2.default.addMessage(_uuid2.default.v1(), msg, isDeletable);
    }
  }, {
    key: 'setContext',
    value: function setContext(newContext) {
      _messageStack2.default.setContext(newContext);
    }
  }, {
    key: 'setTitle',
    value: function setTitle(newTitle) {
      _messageStack2.default.setTitle(newTitle);
    }
  }]);

  return Hermes;
})(_react2.default.Component);

Hermes.defaultProps = {
  autoClose: true,
  autoCloseInMiliseconds: 10000,
  context: 'info',
  title: ''
};

Hermes.propTypes = {
  autoClose: _react2.default.PropTypes.bool,
  autoCloseInMiliseconds: _react2.default.PropTypes.number,
  title: _react2.default.PropTypes.string,
  context: _react2.default.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired
};

Hermes.displayName = 'Hermes';

exports.default = Hermes;