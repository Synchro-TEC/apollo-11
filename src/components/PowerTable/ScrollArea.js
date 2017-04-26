import React from 'react';
import _ from 'lodash';
import TableBody from './TableBody';
import GroupedTableBody from './GroupedTableBody';

class ScrollArea extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let columns = this.props.columns;
    let data = this.props.collection;
    let groupedCols = _.filter(columns, { 'groupBy': true });
    let isGrouped = groupedCols.length > 0;


    let tableBodyOpts = {
      data: data,
      columns: columns
    }

    return (
      <div
        className='PWT-Scroll'
        style={{
          display: 'block',
          overflow: 'auto',
          marginTop: '-31px',
          position: 'relative',
          borderBottom: '1px solid #dadada',
        }}
      >
        <table className='sv-table with--borders with--hover' style={{ tableLayout: 'fixed', marginBottom: '0px' }}>
          {isGrouped ? <GroupedTableBody {...tableBodyOpts} /> : <TableBody {...tableBodyOpts} />}
        </table>
      </div>

    );
  }
}

ScrollArea.displayName = 'ScrollArea';

ScrollArea.propTypes = {
  afterHeight: React.PropTypes.number,
  beforeHeight: React.PropTypes.number,
  collection: React.PropTypes.array.isRequired,
  columns: React.PropTypes.array.isRequired,
  pageSize: React.PropTypes.number.isRequired,
  onScroll: React.PropTypes.func,
  rowHeight: React.PropTypes.number.isRequired,
  totalRecords: React.PropTypes.number,
};

export default ScrollArea;
