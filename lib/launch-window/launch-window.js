'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _launchWindowStyles = require('./launch-window-styles');

var _launchWindowStyles2 = _interopRequireDefault(_launchWindowStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LaunchWindow = function (_React$Component) {
    _inherits(LaunchWindow, _React$Component);

    function LaunchWindow(props) {
        _classCallCheck(this, LaunchWindow);

        var _this = _possibleConstructorReturn(this, (LaunchWindow.__proto__ || Object.getPrototypeOf(LaunchWindow)).call(this, props));

        _this.state = { isVisible: false };
        return _this;
    }

    _createClass(LaunchWindow, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            if (nextState.isVisible && !this.state.isVisible && this.props.beforeOpen) {
                this.props.beforeOpen();
            }

            if (!nextState.isVisible && this.state.isVisible && this.props.beforeClose) {
                this.props.beforeClose();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (!prevState.isVisible && this.state.isVisible && this.props.afterOpen) {
                this.props.afterOpen();
            }

            if (prevState.isVisible && !this.state.isVisible && this.props.afterClose) {
                this.props.afterClose();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            this.setState({ isVisible: true });
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.setState({ isVisible: false });
        }
    }, {
        key: 'onOverlayClicked',
        value: function onOverlayClicked() {
            if (this.props.hideOnOverlayClicked) {
                this.hide();
            }

            if (this.props.onOverlayClicked) {
                this.props.onOverlayClicked();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var overlay;

            var dialogStyles = Object.assign(_launchWindowStyles2.default.dialogStyles, this.props.dialogStyles);
            var overlayStyles = Object.assign(_launchWindowStyles2.default.overlayStyles, this.props.overlayStyles);
            var closeButtonStyle = Object.assign(_launchWindowStyles2.default.closeButtonStyle, this.props.closeButtonStyle);

            if (this.state.isVisible) {
                overlayStyles.display = 'block';
                dialogStyles.display = 'block';
            } else {
                overlayStyles.display = 'none';
                dialogStyles.display = 'none';
            }

            if (this.props.showOverlay) {
                overlay = _react2.default.createElement('div', { onClick: function onClick() {
                        return _this2.onOverlayClicked();
                    }, style: overlayStyles });
            }

            return _react2.default.createElement(
                'section',
                { className: 'launchWindow-wrapper' },
                overlay,
                _react2.default.createElement(
                    'div',
                    { style: dialogStyles },
                    _react2.default.createElement(
                        'a',
                        { onClick: function onClick() {
                                return _this2.hide();
                            }, role: 'button', style: closeButtonStyle },
                        '\xD7'
                    ),
                    _react2.default.createElement(
                        'h2',
                        null,
                        this.props.title
                    ),
                    this.props.children
                )
            );
        }
    }]);

    return LaunchWindow;
}(_react2.default.Component);

LaunchWindow.displayName = 'LaunchWindow';

LaunchWindow.propTypes = {
    afterClose: _react2.default.PropTypes.func,
    afterOpen: _react2.default.PropTypes.func,
    beforeClose: _react2.default.PropTypes.func,
    beforeOpen: _react2.default.PropTypes.func,
    closeButtonStyle: _react2.default.PropTypes.object,
    dialogStyles: _react2.default.PropTypes.object,
    hideOnOverlayClicked: _react2.default.PropTypes.bool,
    onOverlayClicked: _react2.default.PropTypes.func,
    overlayStyles: _react2.default.PropTypes.object,
    showOverlay: _react2.default.PropTypes.bool,
    title: _react2.default.PropTypes.string
};

LaunchWindow.defaultProps = {
    title: '',
    showOverlay: true,
    overlayStyles: _launchWindowStyles2.default.overlayStyles,
    dialogStyles: _launchWindowStyles2.default.dialogStyles,
    closeButtonStyle: _launchWindowStyles2.default.closeButtonStyle,
    hideOnOverlayClicked: false
};

exports.default = LaunchWindow;