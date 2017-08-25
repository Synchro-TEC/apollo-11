import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButton extends Component {
  render() {
    const cssClasses = classNames(
      'sv-button',
      this.props.className,
      this.props.color,
      this.props.full ? 'full' : '',
      this.props.small ? 'small' : ''
    );

    return (
      <button className={cssClasses}>
        {this.props.children}
      </button>
    );
  }
}

SvButton.displayName = 'SvButton';

SvButton.defaultProps = {
  color: 'default',
  full: false,
  small: false
};

SvButton.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'info', 'danger', 'warning', 'default']),
  full: PropTypes.bool,
  small: PropTypes.bool
};

export default SvButton;
