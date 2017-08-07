import React, { Component } from 'react';

class SvRow extends Component {
  render() {
    return (
      <div className="sv-row">
        {this.props.children}
      </div>
    );
  }
}

export default SvRow;