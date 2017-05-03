import React from 'react';
import PropTypes from 'prop-types';

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
  valueOfCell: PropTypes.any
};

export default DataTableCell;
