import React from 'react';
import PropTypes from 'prop-types';
import DataTableBody from './data-table-body/DataTableBody';
import DataTableHeader from './data-table-header/DataTableHeader';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.keys = React.Children.map(props.children, child => {
      return child.props.dataKey;
    });
  }

  render() {
    let { children, className, data, onSort } = this.props;

    return (
      <div className="sv-table-responsive-vertical">
        <table className={className}>
          <DataTableHeader onSort={onSort}>
            {children}
          </DataTableHeader>
          <DataTableBody dataTableHeader={this.keys} dataTableRows={data} />
        </table>
      </div>
    );
  }
}

DataTable.defaultProps = {
  className: 'sv-table with--hover with--borders',
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  onSort: PropTypes.func,
};

DataTable.displayName = 'DataTable';

export default DataTable;
