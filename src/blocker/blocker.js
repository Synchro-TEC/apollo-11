import React from 'react';
import uuid from 'uuid';
import blockerDefaultStyles from './blocker-styles';
import blockerStack from './blocker-stack';

class Blocker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {active: false};
    this.onStackChange = this.onStackChange.bind(this);
  }

  componentWillMount() {
    this._stackId = uuid.v1();
  }

  componentDidMount() {
    blockerStack.addChangeListener(this.onStackChange);
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  componentWillUnmount() {
    blockerStack.removeChangeListener(this.onStackChange);
    blockerStack.removeLoader(this._stackId);
  }

  initialize(props) {
    if (props.show) {
      blockerStack.addLoader(this._stackId, props.priority);
    } else {
      blockerStack.removeLoader(this._stackId);
    }
  }

  onStackChange() {
    this.setState({
      active: blockerStack.getMaxPriority() === this.props.priority
    });
  }

  render() {
    const {
      backgroundStyle,
      children,
      contentBlur,
      disableDefaultStyles,
      foregroundStyle,
      hideContentOnLoad,
      message,
      style,
      show
      } = this.props;

    const {
      active
      } = this.state;

    const shouldShowBlocker = !!active && !!show;

    const bgStyle = Object.assign({},
      disableDefaultStyles ? {} : blockerDefaultStyles.backgroundDefaultStyle,
      backgroundStyle || {}
    );

    const fgStyle = Object.assign({},
      disableDefaultStyles ? {} : blockerDefaultStyles.foregroundDefaultStyle,
      foregroundStyle || {}
    );

    const msgStyle = disableDefaultStyles ? {} : blockerDefaultStyles.messageDefaultStyle;

    const loaderStyle = {position: 'relative', ...style};

    const contentStyle = Object.assign({
      position: 'relative',
      opacity: hideContentOnLoad && show ? 0 : 1
    }, shouldShowBlocker && contentBlur ? {
      'WebkitFilter': `blur(${contentBlur}px)`,
      'MozFilter': `blur(${contentBlur}px)`,
      'OFilter': `blur(${contentBlur}px)`,
      'msFilter': `blur(${contentBlur}px)`,
      'filter': `blur(${contentBlur}px)`
    } : {});

    return shouldShowBlocker ? (
      <div className="sv-blocker" style={loaderStyle}>
        <div className="sv-blocker__content" style={contentStyle}>
          {children}
        </div>

        <div className="sv-blocker__background" style={bgStyle}>
          <div className="sv-blocker__foreground" style={fgStyle}>
            <div className="sv-blocker__message" style={msgStyle}>
              {message || 'loading...'}
            </div>
          </div>
        </div>
      </div>
    ) : (<div style={loaderStyle}>{children}</div>);
  }
}

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

Blocker.defaultProps ={
  priority: 0
};

Blocker.displayName = 'Blocker';

export default Blocker;