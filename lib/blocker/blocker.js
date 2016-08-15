var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import uuid from 'uuid';
import blockerDefaultStyles from './blocker-styles';
import blockerStack from './blocker-stack';

var Blocker = (function (_React$Component) {
  _inherits(Blocker, _React$Component);

  function Blocker(props) {
    _classCallCheck(this, Blocker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Blocker).call(this, props));

    _this.state = { active: false };
    _this.onStackChange = _this.onStackChange.bind(_this);
    return _this;
  }

  _createClass(Blocker, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._stackId = uuid.v1();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      blockerStack.addChangeListener(this.onStackChange);
      this.initialize(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.initialize(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      blockerStack.removeChangeListener(this.onStackChange);
      blockerStack.removeLoader(this._stackId);
    }
  }, {
    key: 'initialize',
    value: function initialize(props) {
      if (props.show) {
        blockerStack.addLoader(this._stackId, props.priority);
      } else {
        blockerStack.removeLoader(this._stackId);
      }
    }
  }, {
    key: 'onStackChange',
    value: function onStackChange() {
      this.setState({
        active: blockerStack.getMaxPriority() === this.props.priority
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var backgroundStyle = _props.backgroundStyle;
      var children = _props.children;
      var contentBlur = _props.contentBlur;
      var disableDefaultStyles = _props.disableDefaultStyles;
      var foregroundStyle = _props.foregroundStyle;
      var hideContentOnLoad = _props.hideContentOnLoad;
      var message = _props.message;
      var style = _props.style;
      var show = _props.show;
      var active = this.state.active;

      var shouldShowBlocker = !!active && !!show;

      var bgStyle = Object.assign({}, disableDefaultStyles ? {} : blockerDefaultStyles.backgroundDefaultStyle, backgroundStyle || {});

      var fgStyle = Object.assign({}, disableDefaultStyles ? {} : blockerDefaultStyles.foregroundDefaultStyle, foregroundStyle || {});

      var msgStyle = disableDefaultStyles ? {} : blockerDefaultStyles.messageDefaultStyle;

      var loaderStyle = _extends({ position: 'relative' }, style);

      var contentStyle = Object.assign({
        position: 'relative',
        opacity: hideContentOnLoad && show ? 0 : 1
      }, shouldShowBlocker && contentBlur ? {
        'WebkitFilter': 'blur(' + contentBlur + 'px)',
        'MozFilter': 'blur(' + contentBlur + 'px)',
        'OFilter': 'blur(' + contentBlur + 'px)',
        'msFilter': 'blur(' + contentBlur + 'px)',
        'filter': 'blur(' + contentBlur + 'px)'
      } : {});

      return shouldShowBlocker ? React.createElement(
        'div',
        { className: 'sv-blocker', style: loaderStyle },
        React.createElement(
          'div',
          { className: 'sv-blocker__content', style: contentStyle },
          children
        ),
        React.createElement(
          'div',
          { className: 'sv-blocker__background', style: bgStyle },
          React.createElement(
            'div',
            { className: 'sv-blocker__foreground', style: fgStyle },
            React.createElement(
              'div',
              { className: 'sv-blocker__message', style: msgStyle },
              message || 'loading...'
            )
          )
        )
      ) : React.createElement(
        'div',
        { style: loaderStyle },
        children
      );
    }
  }]);

  return Blocker;
})(React.Component);

Blocker.propTypes = {
  backgroundStyle: React.PropTypes.object,
  children: React.PropTypes.node,
  contentBlur: React.PropTypes.number,
  disableDefaultStyles: React.PropTypes.bool,
  foregroundStyle: React.PropTypes.object,
  hideContentOnLoad: React.PropTypes.bool,
  message: React.PropTypes.node,
  priority: React.PropTypes.number,
  show: React.PropTypes.bool.isRequired,
  style: React.PropTypes.object
};

Blocker.defaultProps = {
  priority: 0
};

Blocker.displayName = 'Blocker';

export default Blocker;