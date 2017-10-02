import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonAnimated extends Component {
  render() {
    const cssClasses = classNames(
      'sv-bt-animated',
      this.props.className,
      this.props.color,
      this.props.icon,
      this.props.full ? 'full' : '',
      this.props.small ? ' small' : ''
    );
    return <button className={cssClasses}>{this.props.children}</button>;
  }
}

SvButtonAnimated.displayName = 'SvButtonAnimated';

SvButtonAnimated.defaultProps = {
  color: 'default',
  small: false,
  full: false,
};

SvButtonAnimated.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'info', 'danger', 'warning', 'default']).isRequired,
  full: PropTypes.bool,
  icon: PropTypes.string,
  small: PropTypes.bool,
};

export default SvButtonAnimated;
