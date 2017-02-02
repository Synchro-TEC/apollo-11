import React from 'react';
import DataTableCell from './DataTableCell';
import _uniqueId from 'lodash/uniqueId';

class DataTableBody extends React.Component {
  render() {

    let rows = this.props.dataTableRows.map((dataTableRow, i) => {
      let cells = this.props.dataTableHeader.map((dataTableHeaderKey, j) => {
        return (
          <DataTableCell key={_uniqueId('cell_')} valueOfCell={dataTableRow[dataTableHeaderKey]}/>
        );
      });
      return (<tr key={_uniqueId('row_')}>{cells}</tr>);
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

DataTableBody.propTypes = {
  dataTableRows: React.PropTypes.array.isRequired,
  dataTableHeader: React.PropTypes.array.isRequired
};

export default DataTableBody;
