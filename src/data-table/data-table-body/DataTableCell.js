import React from 'react';
import _uniqueId from 'lodash/uniqueId';

class DataTableCell extends React.Component {
  render() {
    let { valueOfCell } = this.props;

    return (
      <td>
        {valueOfCell}
      </td>
    );
  }
}

DataTableCell.propTypes = {
  valueOfCell: React.PropTypes.any
};

export default DataTableCell;
