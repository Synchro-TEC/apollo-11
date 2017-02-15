import React from 'react';
import DataTableBody from './data-table-body/DataTableBody';
import DataTableHeader from './data-table-header/DataTableHeader';

class DataTable extends React.Component {

  constructor(props) {
    super(props);
    this.keys = React.Children.map(props.children, (child) => {
      return child.props.dataKey;
    });
  }

  render() {
    let {children, className, data, onSort} = this.props;

    return (
      <div className='sv-table-responsive-vertical'>
        <table className={className}>
          <DataTableHeader onSort={onSort}>{children}</DataTableHeader>
          <DataTableBody dataTableHeader={this.keys} dataTableRows={data} />
        </table>
      </div>
    );
  }
}

DataTable.defaultProps = {
  className: 'sv-table with--hover with--borders'
};

DataTable.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  onSort: React.PropTypes.func,
};

export default DataTable;
