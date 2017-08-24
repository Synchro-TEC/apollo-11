import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonOutline extends Component {
  render() {
    const cssClasses = classNames(
			'sv-button',
			this.props.className,
			this.props.fill,
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
  fill: 'out-default',
  small: false
};

SvButtonOutline.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.oneOf([
    'out-primary',
    'out-info',
    'out-danger',
    'out-warning',
    'out-default'
  ]),
  small: PropTypes.bool
};

export default SvButtonOutline;
