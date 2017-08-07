import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';


class SvColumn extends Component {

  render() {
    const cssClasses = classNames('sv-column', this.props.className);
    return (
      <div className={cssClasses}>
        {this.props.children}
      </div>
    );
  }
}

SvColumn.displayName = 'SvColumn';

SvColumn.defaultProps = {
};

SvColumn.propTypes = {
  className: PropTypes.string,
};

export default SvColumn;