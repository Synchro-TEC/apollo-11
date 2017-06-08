import React from 'react';
import PropTypes from 'prop-types';
// import _map from 'lodash/map';
import _groupBy from 'lodash/groupBy';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _union from 'lodash/union';
import _filter from 'lodash/filter';
import _sumBy from 'lodash/sumBy';
import v4 from 'uuid/v4';
import _cloneDeep from 'lodash/cloneDeep';

// const CellStyle = {
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   textOverflow: 'ellipsis',
//   borderBottom: '1px solid #e1e1e1',
//   borderRight: '1px solid #e1e1e1',
//   padding: '8px 5px',
// };

class GroupedTableBody extends React.Component {

  constructor(props) {
    super(props);
  }

  sumRowSpan(row) {
    if (_has(row, 'nested')) {
      row.rowSpan = 0;

      row.nested.map((nestedRow) => {
        nestedRow.parent = row;
        this.sumRowSpan(nestedRow);
      });

      row.rowSpan = _sumBy(row.nested, (r) => { return r.rowSpan; });
    } else {
      row.rowSpan = 1;
    }
  }

  renderGroupedColumns(groupedCols, row) {
    let tds = [];
    let parent = row.parent;
    while (parent !== null) {
      if (!parent.done) {
        // debugger;
        let col = groupedCols[parent.name][0];
        let style = _has(col, 'width') ? {width: `${col.width}px` } : {};
        let rendered = col.formatter ? col.formatter({[parent.name]: parent.value}) : parent.value;
        tds.push(<td className='pw-table-grouped-tbody-cell' key={v4()} rowSpan={parent.rowSpan} style={style}>{rendered}</td>);
        parent.done = true;
      }
      parent = _has(parent, 'parent') ? parent.parent : null;
    }
    return tds.reverse();
  }

  renderNonGroupedColumns(nonGroupedColumns, row) {
    return nonGroupedColumns.map((col) => {
      let style = _has(col, 'width') ? {width: `${col.width}px` } : {};
      let rendered = col.formatter ? col.formatter(row) : _get(row, col.key);
      return (<td className='pw-table-grouped-tbody-cell' key={v4()} style={style}>{rendered}</td>);
    });
  }

  renderRow(nonGroupedColumns, groupedCols, row) {
    if (_has(row, 'nested')) {
      return row.nested.map((nestedRow) => {
        return this.renderRow(nonGroupedColumns, groupedCols, nestedRow);
      });
    } else {
      let groupedTds = this.renderGroupedColumns(groupedCols, row);
      let nonGroupedTds = this.renderNonGroupedColumns(nonGroupedColumns, row);
      let tds = _union(groupedTds, nonGroupedTds);

      return (<tr key={v4()}>{tds}</tr>);
    }
  }

  render() {
    let nonGroupedColumns = _filter(this.props.columns, { 'groupBy': false });
    let groupedCols = _filter(this.props.columns, { 'groupBy': true });

    let data = _cloneDeep(this.props.data);
    this.sumRowSpan(data, null);

    let trs = data.nested.map((nestedRow) => {
      return this.renderRow(nonGroupedColumns, _groupBy(groupedCols, 'key'), nestedRow);
    });


    return (<tbody>{trs}</tbody>);
  }


}

GroupedTableBody.displayName = 'GroupedTableBody';

GroupedTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  // widths: PropTypes.array.isRequired,
};

export default GroupedTableBody;