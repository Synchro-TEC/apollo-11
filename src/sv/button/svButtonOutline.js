import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonOutline extends Component {
  render() {
    const cssClasses = classNames(
			'sv-button',
			this.props.className,
			this.props.fill
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
  fill: 'out-primary'
};

SvButtonOutline.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.oneOf([
    'out-primary',
    'out-info',
    'out-danger',
    'out-warning',
    'out-default'
  ])
};

export default svButtonOutline;
