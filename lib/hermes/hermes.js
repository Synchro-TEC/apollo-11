var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Update from 'react-addons-update';
import HermesAPI from './hermes-api';
import Message from './message';
import HermesStyles from './hermes-styles';
import uuid from 'uuid';

var _hideTimeOut;

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

    _this.onStackChange = _this.onStackChange.bind(_this);
    return _this;
  }

  _createClass(Hermes, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      HermesAPI.addChangeListener(this.onStackChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      HermesAPI.removeChangeListener(this.onStackChange);
    }
  }, {
    key: 'onStackChange',
    value: function onStackChange() {
      var _this2 = this;

      var newState = Update(this.state, {
        context: { $set: HermesAPI.context || this.props.context },
        messages: { $set: HermesAPI.messages },
        title: { $set: HermesAPI.title || this.props.title },
        visible: { $set: HermesAPI.messages.length }
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
      var newState = Update(this.state, {
        visible: { $set: false }
      });
      HermesAPI.clearMessages();
      this.setState(newState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var createMessage = function createMessage(message) {
        return React.createElement(Message, { key: message.id, message: message });
      };

      var visible = this.state.visible ? 'block' : 'none';

      var display = { display: visible };
      var styles = Object.assign({}, display, HermesStyles[this.state.context]);

      return React.createElement(
        'div',
        { style: styles },
        React.createElement(
          'h3',
          null,
          this.state.title,
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this3.hide();
              }, style: HermesStyles.closeButtonHermes },
            '×'
          )
        ),
        React.createElement(
          'ul',
          { style: HermesStyles.msgListStyle },
          this.state.messages.map(createMessage)
        )
      );
    }
  }], [{
    key: 'addMessage',
    value: function addMessage(msg) {
      var isDeletable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      HermesAPI.addMessage(uuid.v1(), msg, isDeletable);
    }
  }, {
    key: 'setContext',
    value: function setContext(newContext) {
      HermesAPI.setContext(newContext);
    }
  }, {
    key: 'setTitle',
    value: function setTitle(newTitle) {
      HermesAPI.setTitle(newTitle);
    }
  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      HermesAPI.clearMessages();
    }
  }]);

  return Hermes;
})(React.Component);

Hermes.defaultProps = {
  autoClose: true,
  autoCloseInMiliseconds: 10000,
  context: 'info',
  title: ''
};

Hermes.propTypes = {
  autoClose: React.PropTypes.bool,
  autoCloseInMiliseconds: React.PropTypes.number,
  context: React.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired,
  styles: React.PropTypes.object,
  title: React.PropTypes.string
};

Hermes.displayName = 'Hermes';

export default Hermes;