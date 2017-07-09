import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _groupBy from 'lodash/groupBy';
import _has from 'lodash/has';
import _union from 'lodash/union';
import _filter from 'lodash/filter';
import _sumBy from 'lodash/sumBy';
import v4 from 'uuid/v4';

const CellStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

class GroupedTableBody extends React.Component {
  constructor(props) {
    super(props);

    this.groupByMulti = this.groupByMulti.bind(this);
  }

  groupByMulti(list, values) {
    if (!values.length) {
      return list;
    }

    let grouped = _groupBy(list, values[0]);

    let result = [];
    for (let prop in grouped) {
      result.push({
        name: values[0],
        value: prop,
        nested: this.groupByMulti(grouped[prop], values.slice(1)),
      });
    }

    return result;
  }

  sumRowSpan(row) {
    if (_has(row, 'nested')) {
      row.rowSpan = 0;

      row.nested.map(nestedRow => {
        nestedRow.parent = row;
        this.sumRowSpan(nestedRow);
      });

      row.rowSpan = _sumBy(row.nested, r => {
        return r.rowSpan;
      });
    } else {
      row.rowSpan = 1;
    }
  }

  renderGroupedColumns(groupedCols, row) {
    let tds = [];
    let parent = row.parent;
    while (parent !== null) {
      if (!parent.done) {
        let col = groupedCols[parent.name][0];
        let rendered = col.formatter ? col.formatter({ [parent.name]: parent.value }) : parent.value;
        tds.push(
          <td key={v4()} rowSpan={parent.rowSpan} style={CellStyle}>
            {rendered}
          </td>
        );
        parent.done = true;
      }
      parent = parent.parent;
    }
    return tds.reverse();
  }

  renderNonGroupedColumns(nonGroupedColumns, row) {
    return nonGroupedColumns.map(col => {
      let rendered = col.formatter ? col.formatter(row) : row[col.key];
      return (
        <td key={v4()} style={CellStyle}>
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

      return (
        <tr key={v4()}>
          {tds}
        </tr>
      );
    }
  }

  render() {
    let nonGroupedColumns = _filter(this.props.columns, { groupBy: false });
    let groupedCols = _filter(this.props.columns, { groupBy: true });
    let data = this.groupByMulti(this.props.data, _map(groupedCols, 'key'));

    data.map(row => {
      this.sumRowSpan(row, null);
    });

    let trs = data.map(row => {
      return row.nested.map(nestedRow => {
        return this.renderRow(nonGroupedColumns, _groupBy(groupedCols, 'key'), nestedRow);
      });
    });

    return (
      <tbody>
        {trs}
      </tbody>
    );
  }
}

GroupedTableBody.displayName = 'GroupedTableBody';

GroupedTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default GroupedTableBody;
