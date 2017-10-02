import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonLink extends Component {
  render() {
    const linkCss = `link-${this.props.color}`;
    const cssClasses = classNames('sv-button link', this.props.className, linkCss, this.props.small ? ' small' : '');
    return <button className={cssClasses}>{this.props.children}</button>;
  }
}

SvButtonLink.displayName = 'SvButtonLink';

SvButtonLink.defaultProps = {
  color: 'default',
  small: false,
};

SvButtonLink.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'info', 'danger', 'warning', 'default']).isRequired,
  small: PropTypes.bool,
};

export default SvButtonLink;
