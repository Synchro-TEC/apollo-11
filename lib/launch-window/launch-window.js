var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import styles from './launch-window-styles';

var LaunchWindow = (function (_React$Component) {
    _inherits(LaunchWindow, _React$Component);

    function LaunchWindow(props) {
        _classCallCheck(this, LaunchWindow);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LaunchWindow).call(this, props));

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

            var dialogStyles = Object.assign(styles.dialogStyles, this.props.dialogStyles);
            var overlayStyles = Object.assign(styles.overlayStyles, this.props.overlayStyles);
            var closeButtonStyle = Object.assign(styles.closeButtonStyle, this.props.closeButtonStyle);

            if (this.state.isVisible) {
                overlayStyles.display = 'block';
                dialogStyles.display = 'block';
            } else {
                overlayStyles.display = 'none';
                dialogStyles.display = 'none';
            }

            if (this.props.showOverlay) {
                overlay = React.createElement('div', { onClick: function onClick() {
                        return _this2.onOverlayClicked();
                    }, style: overlayStyles });
            }

            return React.createElement(
                'section',
                { className: 'launchWindow-wrapper' },
                overlay,
                React.createElement(
                    'div',
                    { style: dialogStyles },
                    React.createElement(
                        'a',
                        { onClick: function onClick() {
                                return _this2.hide();
                            }, role: 'button', style: closeButtonStyle },
                        '×'
                    ),
                    React.createElement(
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
})(React.Component);

LaunchWindow.displayName = 'LaunchWindow';

LaunchWindow.propTypes = {
    afterClose: React.PropTypes.func,
    afterOpen: React.PropTypes.func,
    beforeClose: React.PropTypes.func,
    beforeOpen: React.PropTypes.func,
    closeButtonStyle: React.PropTypes.object,
    dialogStyles: React.PropTypes.object,
    hideOnOverlayClicked: React.PropTypes.bool,
    onOverlayClicked: React.PropTypes.func,
    overlayStyles: React.PropTypes.object,
    showOverlay: React.PropTypes.bool,
    title: React.PropTypes.string
};

LaunchWindow.defaultProps = {
    title: '',
    showOverlay: true,
    overlayStyles: styles.overlayStyles,
    dialogStyles: styles.dialogStyles,
    closeButtonStyle: styles.closeButtonStyle,
    hideOnOverlayClicked: false
};

export default LaunchWindow;