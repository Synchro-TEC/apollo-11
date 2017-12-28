import React from 'react';
import PropTypes from 'prop-types';
import _groupBy from 'lodash/groupBy';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _union from 'lodash/union';
import _filter from 'lodash/filter';
import _sumBy from 'lodash/sumBy';
import v4 from 'uuid/v4';
import _cloneDeep from 'lodash/cloneDeep';
import currency from 'currency.js';
import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';
import { log } from 'util';

function round(number, precision) {
  const factor = Math.pow(10, precision);
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

var real = value => currency(value, { separator: '.', decimal: ',' });

class GroupedTableBody extends React.Component {
  constructor(props) {
    super(props);
  }

  renderGroupedColumns(groupedCols, row) {
    let tds = [];
    const hasAggr = this.props.aggr.length;
    let parent = row.parent;
    while (parent !== null) {
      if (!parent.done) {
        let col = groupedCols[parent.name][0];
        let style = _has(col, 'width') ? { width: `${col.width}px` } : {};
        let rendered = col.formatter ? col.formatter({ [parent.name]: parent.value }, col.key) : parent.value;

        let rowSpanCalculated = parent.rowSpan;

        if (hasAggr && !Object.keys(parent).includes('parent')) {
          rowSpanCalculated += parent.nested.length;
        }

        if (hasAggr && Object.keys(parent).includes('parent')) {
          rowSpanCalculated += 1;
        }

        tds.push(
          <td className="pw-table-grouped-tbody-cell" key={v4()} rowSpan={rowSpanCalculated} style={style}>
            {rendered}
          </td>
        );
        parent.done = true;
      }
      parent = _has(parent, 'parent') ? parent.parent : null;
    }
    return tds.reverse();
  }

  renderNonGroupedColumns(nonGroupedColumns, row) {
    return nonGroupedColumns.map(col => {
      let style = _has(col, 'width') ? { width: `${col.width}px` } : {};
      let rendered = col.formatter ? col.formatter(row, col.key) : _get(row, col.key);
      return (
        <td className="pw-table-grouped-tbody-cell" key={v4()} style={style}>
          {rendered}
        </td>
      );
    });
  }

  renderRow(nonGroupedColumns, groupedCols, row) {
    if (_has(row, 'nested')) {
      return row.nested.map(nestedRow => {
        return this.renderRow(nonGroupedColumns, groupedCols, nestedRow);
      });
    } else {
      let groupedTds = this.renderGroupedColumns(groupedCols, row);
      let nonGroupedTds = this.renderNonGroupedColumns(nonGroupedColumns, row);
      let tds = _union(groupedTds, nonGroupedTds);

      return <tr key={v4()}>{tds}</tr>;
    }
  }

  render() {
    let nonGroupedColumns = _filter(this.props.columns, { groupBy: false });
    let groupedCols = _filter(this.props.columns, { groupBy: true });

    let data = _cloneDeep(this.props.data);
    const hasAggr = !!this.props.aggr.length;
    let aggrs = [];

    if (hasAggr) {
      aggrs = _cloneDeep(this.props.aggr);
    }

    let trs = data.nested.map((nestedRow, i) => {
      let trAggrs = '';

      if (hasAggr) {
        let aggrTds = [];

        // aggrTds.push(<td key={v4()} colSpan={groupedCols.length} />);

        aggrs.forEach(ag => {
          ag.moneyValue = real(_sumBy(nestedRow.nested, ag.key)).format();
          ag.value = round(_sumBy(nestedRow.nested, ag.key), 2);
        });

        nonGroupedColumns.forEach(col => {
          const sumCol = aggrs.find(a => a.key === col.key);
          const sumStyle = { fontWeight: 'bold', backgroundColor: '#eef2f7' };
          if (sumCol) {
            aggrTds.push(
              <td className="pw-table-grouped-tbody-cell" style={sumStyle} key={v4()}>
                {sumCol.value}
              </td>
            );
          } else {
            aggrTds.push(
              <td className="pw-table-grouped-tbody-cell" style={sumStyle} key={v4()}>
                -
              </td>
            );
          }
        });

        trAggrs = <tr key={v4()}>{aggrTds}</tr>;
      }

      return [this.renderRow(nonGroupedColumns, _groupBy(groupedCols, 'key'), nestedRow), trAggrs];
    });

    return (
      <tbody>
        {trs[0]}
        {trs[1]}
      </tbody>
    );
  }
}

GroupedTableBody.displayName = 'GroupedTableBody';

GroupedTableBody.propTypes = {
  aggr: PropTypes.array,
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
};

export default GroupedTableBody;
