import React from 'react';

class DataTableCell extends React.Component {
  render() {
    let {valueOfCell} = this.props;

    return (
      <td>
        {valueOfCell}
      </td>
    );
  }
}

DataTableCell.displayName = 'DataTableCell';

DataTableCell.propTypes = {
  valueOfCell: React.PropTypes.any
};

export default DataTableCell;
