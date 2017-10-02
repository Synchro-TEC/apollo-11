import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SvCol extends Component {
  render() {
    const cssClasses = classNames('sv-column', this.props.className, this.props.fixedSize, this.props.size);
    return <div className={cssClasses}>{this.props.children}</div>;
  }
}

SvCol.displayName = 'SvCol';

SvCol.propTypes = {
  className: PropTypes.string,
  fixedSize: PropTypes.oneOf(['_100--fixed', '_150--fixed', '_200--fixed', '_250--fixed', '_300--fixed']),
  size: PropTypes.oneOf(['_20', '_25', '_40', '_60', '_75', '_80']),
};

export default SvCol;
