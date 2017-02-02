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
          <DataTableHeader>{this.props.children}</DataTableHeader>
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
  className: React.PropTypes.string,
  rows: React.PropTypes.array.isRequired
};

export default DataTable;
