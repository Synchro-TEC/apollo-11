'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _HermesApi = require('./HermesApi');

var _HermesApi2 = _interopRequireDefault(_HermesApi);

var _HermesMessageItem = require('./HermesMessageItem');

var _HermesMessageItem2 = _interopRequireDefault(_HermesMessageItem);

var _HermesStyles = require('./HermesStyles');

var _HermesStyles2 = _interopRequireDefault(_HermesStyles);

var _HermesConstants = require('./HermesConstants');

var _HermesConstants2 = _interopRequireDefault(_HermesConstants);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _hideTimeOut;

var Hermes = (function (_React$Component) {
  _inherits(Hermes, _React$Component);

  function Hermes(props) {
    _classCallCheck(this, Hermes);

    var _this = _possibleConstructorReturn(this, (Hermes.__proto__ || Object.getPrototypeOf(Hermes)).call(this, props));

    _this.state = {
      autoClose: _this.props.autoClose,
      autoCloseInMiliseconds: _this.props.autoCloseInMiliseconds,
      context: _this.props.context,
      messages: [],
      position: _this.props.position,
      title: _this.props.title,
      visible: false
    };

    _this.onStackChange = _this.onStackChange.bind(_this);
    return _this;
  }

  _createClass(Hermes, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _HermesApi2.default.addChangeListener(this.onStackChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _HermesApi2.default.removeChangeListener(this.onStackChange);
    }
  }, {
    key: 'onStackChange',
    value: function onStackChange() {
      var _this2 = this;

      var newState = (0, _reactAddonsUpdate2.default)(this.state, {
        context: { $set: _HermesApi2.default.context || this.props.context },
        messages: { $set: _HermesApi2.default.messages },
        position: { $set: _HermesApi2.default.position || this.props.position },
        title: { $set: _HermesApi2.default.title || this.props.title },
        visible: { $set: _HermesApi2.default.messages.length }
      });
      this.setState(newState);
      if (_hideTimeOut) {
        clearTimeout(_hideTimeOut);
      }

      _hideTimeOut = setTimeout(function () {
        if (_this2.state.autoClose && _this2.state.visible) {
          _this2.hide();
        }
      }, this.state.autoCloseInMiliseconds);
    }
  }, {
    key: 'hide',
    value: function hide() {
      clearTimeout(_hideTimeOut);
      var newState = (0, _reactAddonsUpdate2.default)(this.state, {
        visible: { $set: false }
      });
      _HermesApi2.default.clearMessages();
      this.setState(newState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var createMessage = function createMessage(message) {
        return _react2.default.createElement(_HermesMessageItem2.default, { key: message.id, message: message });
      };

      var visible = this.state.visible ? 'block' : 'none';
      var display = { display: visible };
      var cssClasses = (0, _classnames2.default)('sv-messagebox sv-no-margins', this.state.context);
      var styles = Object.assign({}, display, _HermesStyles2.default[this.state.position]);

      return _react2.default.createElement(
        'div',
        { className: cssClasses, style: styles },
        _react2.default.createElement(
          'button',
          { className: 'sv-messagebox__close', onClick: function onClick() {
              return _this3.hide();
            } },
          '×'
        ),
        _react2.default.createElement(
          'header',
          null,
          _react2.default.createElement(
            'h6',
            null,
            this.state.title
          )
        ),
        _react2.default.createElement(
          'main',
          null,
          _react2.default.createElement(
            'ul',
            { style: _HermesStyles2.default.msgListStyle },
            this.state.messages.map(createMessage)
          )
        )
      );
    }
  }], [{
    key: 'addMessage',
    value: function addMessage(msg) {
      var isDeletable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _HermesApi2.default.addMessage(_uuid2.default.v1(), msg, isDeletable);
    }
  }, {
    key: 'setContext',
    value: function setContext(newContext) {
      _HermesApi2.default.setContext(newContext);
    }
  }, {
    key: 'setPosition',
    value: function setPosition(newPosition) {
      _HermesApi2.default.setPosition(newPosition);
    }
  }, {
    key: 'setTitle',
    value: function setTitle(newTitle) {
      _HermesApi2.default.setTitle(newTitle);
    }
  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      _HermesApi2.default.clearMessages();
    }
  }]);

  return Hermes;
})(_react2.default.Component);

Hermes.defaultProps = {
  autoClose: true,
  autoCloseInMiliseconds: 10000,
  context: 'info',
  position: 'bottom',
  title: ''
};

Hermes.propTypes = {
  autoClose: _react2.default.PropTypes.bool,
  autoCloseInMiliseconds: _react2.default.PropTypes.number,
  context: _react2.default.PropTypes.oneOf(_HermesConstants2.default.allowedContexts).isRequired,
  position: _react2.default.PropTypes.oneOf(_HermesConstants2.default.allowedPositions),
  title: _react2.default.PropTypes.string
};

Hermes.displayName = 'Hermes';

exports.default = Hermes;