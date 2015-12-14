'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
      messages: _this.props.messages
    };
    return _this;
  }

  _createClass(Hermes, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'render',
    value: function render() {

      var createMessage = function createMessage(message, i) {
        return _react2.default.createElement(
          'li',
          { key: i },
          message.text
        );
      };

      var visible = this.state.messages.length ? 'block' : 'none';

      return _react2.default.createElement(
        'div',
        { style: { display: visible } },
        _react2.default.createElement(
          'h3',
          null,
          this.props.title
        ),
        _react2.default.createElement(
          'ul',
          null,
          this.props.messages.map(createMessage)
        )
      );
    }
  }]);

  return Hermes;
})(_react2.default.Component);

Hermes.defaultProps = {
  messages: []
};

Hermes.propTypes = {
  title: _react2.default.PropTypes.string,
  messages: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({ text: _react2.default.PropTypes.string.isRequired })),
  context: _react2.default.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired
};

Hermes.displayName = 'Hermes';

exports.default = Hermes;