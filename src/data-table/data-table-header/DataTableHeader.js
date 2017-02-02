import React from 'react';

class DataTableHeader extends React.Component {
  render() {
    return (
      <thead>
        <tr>{this.props.children}</tr>
      </thead>
    );
  }
}

export default DataTableHeader;
