import React from 'react';
import _uniqueId from 'lodash/uniqueId';

class GridRow extends React.Component {
  render() {

    let { row } = this.props;
    let columns = [];

    for (let property in row) {
      if(row.hasOwnProperty(property)) {
        columns.push(
          <td key={_uniqueId()}>
            {row[property]}
          </td>
        );
      }
    }

    return (
      <tr>
        {columns}
      </tr>
    );
  }
}

GridRow.propTypes = {
  row: React.PropTypes.object.isRequired
};

export default GridRow;