import React from 'react';
import DataTableBody from './data-table-body/DataTableBody';
import Paginate from './paginate/Paginate';
import DataTableHeader from './data-table-header/DataTableHeader';

class DataTable extends React.Component {

  constructor(props) {
    super(props);
    this.keys = React.Children.map(props.children, (child) => {
      return child.props.dataKey;
    });
  }

  render() {
    let {className, children} = this.props;

    return (
      <div className='sv-table-responsive-vertical'>
        <table className={className}>
          <DataTableHeader onSort={this.props.onSort}>{this.props.children}</DataTableHeader>
          <DataTableBody dataTableRows={this.props.rows} dataTableHeader={this.keys} />
        </table>
      </div>
    );
  }
}

DataTable.defaultProps = {
  className: 'sv-table with--hover with--borders'
};

DataTable.propTypes = {
  //String, class to add in DataTable
  className: React.PropTypes.string,

  //Array, the data to DataTable
  rows: React.PropTypes.array.isRequired,

  //Callback function to exec when user makes sort in a column
  onSort: React.PropTypes.func,
};

export default DataTable;
