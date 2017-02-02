import React from 'react';

class DataTableHeader extends React.Component {

  constructor(props){
    super(props);
  }

  renderWithProps() {
    return this.props.children.map((child, i) => {
      let clone = React.cloneElement(
        child, {onSort: this.props.onSort, key: `headerCell-${i}`}
      );
      return clone;
    });
  }

  render() {
    return (
      <thead>
        <tr>{this.renderWithProps()}</tr>
      </thead>
    );
  }
}

export default DataTableHeader;
