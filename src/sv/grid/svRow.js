import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';


class SvRow extends Component {

  render() {
    const rowType = this.props.withGutter ? 'sv-row--with-gutter' : 'sv-row';
    const cssClasses = classNames(rowType, this.props.className);
    return (
      <div className={cssClasses}>
        {this.props.children}
      </div>
    );
  }
}

SvRow.displayName = 'SvRow';

SvRow.defaultProps = {
  withGutter: false,
};

SvRow.propTypes = {
  className: PropTypes.string,
  withGutter: PropTypes.bool,
};

export default SvRow;