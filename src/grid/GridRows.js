import React from 'react';
import GridRow from './GridRow';

class GridRows extends React.Component {
  render() {

    let rows = this.props.gridRows.map((row, i) => {
      return (
        <GridRow key={i} row={row}/>
      );
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

GridRows.propTypes = {
  gridRows: React.PropTypes.array.isRequired
};

export default GridRows;
