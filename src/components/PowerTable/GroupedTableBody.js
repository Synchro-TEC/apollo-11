import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const CellStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

class GroupedTableBody extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let nonGroupedColumns = _.filter(this.props.columns, { 'groupBy': false });
        let groupedCols = _.filter(this.props.columns, { 'groupBy': true });
        let data = this.groupByMulti(this.props.data, _.map(groupedCols, 'key'));

        data.map((row) => {
            this.sumRowSpan(row, null);
        });

        let trs = data.map((row) => {
            return row.nested.map((nestedRow) => {
                return this.renderRow(nonGroupedColumns, _.groupBy(groupedCols, 'key'), nestedRow);
            });
        });

        return (<tbody>{trs}</tbody>);;
    }

    groupByMulti = (list, values) => {

        if (!values.length) {
            return list;
        }

        let grouped = _.groupBy(list, values[0]);

        let result = [];
        for (let prop in grouped) {
            result.push({
                name: values[0],
                value: prop,
                nested: this.groupByMulti(grouped[prop], values.slice(1))
            })
        }

        return result;
    };

    sumRowSpan(row) {
        if (_.has(row, 'nested')) {
            row.rowSpan = 0;

            row.nested.map((nestedRow) => {
                nestedRow.parent = row;
                this.sumRowSpan(nestedRow);
            });

            row.rowSpan = _.sumBy(row.nested, (r) => { return r.rowSpan; });
        } else {
            row.rowSpan = 1;
        }
    }

    renderGroupedColumns(groupedCols, row) {
        let tds = [];
        let parent = row.parent;
        while (parent != null) {
            if (!parent.done) {
                let col = groupedCols[parent.name][0];
                let rendered = col.formatter ? col.formatter({[parent.name]: parent.value}) : parent.value;
                tds.push(<td key={_.uniqueId()} style={CellStyle} rowSpan={parent.rowSpan}>{rendered}</td>);
                parent.done = true;
            }
            parent = parent.parent;
        }
        return tds.reverse();
    }

    renderNonGroupedColumns(nonGroupedColumns, row) {
        return nonGroupedColumns.map((col) => {
            let rendered = col.formatter ? col.formatter(row) : row[col.key];
            return (<td style={CellStyle} key={_.uniqueId()}>{rendered}</td>);
        });
    }

    renderRow(nonGroupedColumns, groupedCols, row) {
        if (_.has(row, 'nested')) {
            return row.nested.map((nestedRow) => {
                return this.renderRow(nonGroupedColumns, groupedCols, nestedRow);
            });
        } else {
            let groupedTds = this.renderGroupedColumns(groupedCols, row);
            let nonGroupedTds = this.renderNonGroupedColumns(nonGroupedColumns, row);
            let tds = _.union(groupedTds, nonGroupedTds);

            return (<tr key={_.uniqueId()}>{tds}</tr>);
        }
    }

}

GroupedTableBody.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
}

export default GroupedTableBody;