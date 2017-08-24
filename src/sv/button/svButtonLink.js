import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvButtonLink extends Component {
  render() {
    const cssClasses = classNames(
			'sv-button link',
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

SvButtonLink.displayName = 'SvButtonLink';

SvButtonLink.defaultProps = {
  fill: 'link-default',
  small: false
};

SvButtonLink.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.oneOf([
    'link-primary',
    'link-info',
    'link-danger',
    'link-warning',
    'link-default'
  ]),
  small: PropTypes.bool
};

export default SvButtonLink;
