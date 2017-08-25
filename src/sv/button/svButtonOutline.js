import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonOutline extends Component {
  render() {
    const outLineCss = `out-${this.props.color}`;
    const cssClasses = classNames(
			'sv-button',
			this.props.className,
			outLineCss,
			this.props.full ? 'full' : '',
			this.props.small ? ' small' : ''
		);
    return (
			<div className={cssClasses}>
				{this.props.children}
			</div>
    );
  }
}

SvButtonOutline.displayName = 'SvButtonOutline';

SvButtonOutline.defaultProps = {
  color: 'default',
  small: false,
  full: false
};

SvButtonOutline.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'info', 'danger', 'warning', 'default'])
		.isRequired,
  full: PropTypes.bool,
  small: PropTypes.bool
};

export default SvButtonOutline;
