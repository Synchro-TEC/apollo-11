import React from 'react';
import PropTypes from 'prop-types';
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
      columns: columns,
      columnsWidth: this.props.columnsWidth
    };

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
        <table className='sv-table with--grid with--hover' style={{ tableLayout: 'fixed', marginBottom: '0px' }}>
          {isGrouped ? <GroupedTableBody {...tableBodyOpts} /> : <TableBody {...tableBodyOpts} />}
        </table>
      </div>

    );
  }
}

ScrollArea.displayName = 'ScrollArea';

ScrollArea.propTypes = {
  afterHeight: PropTypes.number,
  beforeHeight: PropTypes.number,
  collection: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  columnsWidth: PropTypes.array,
  onScroll: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  totalRecords: PropTypes.number,
};

export default ScrollArea;
