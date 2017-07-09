import React from 'react';
import PropTypes from 'prop-types';
import DataTableCell from './DataTableCell';
import _uniqueId from 'lodash/uniqueId';

class DataTableBody extends React.Component {
  render() {
    let rows = this.props.dataTableRows.map(dataTableRow => {
      let cells = this.props.dataTableHeader.map(dataTableHeaderKey => {
        return <DataTableCell key={_uniqueId('cell_')} valueOfCell={dataTableRow[dataTableHeaderKey]} />;
      });
      return (
        <tr key={_uniqueId('row_')}>
          {cells}
        </tr>
      );
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

DataTableBody.displayName = 'DataTableBody';

DataTableBody.propTypes = {
  dataTableHeader: PropTypes.array.isRequired,
  dataTableRows: PropTypes.array.isRequired,
};

export default DataTableBody;
