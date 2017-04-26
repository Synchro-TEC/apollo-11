import React from 'react';
import _ from 'lodash';

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
                return this.renderRow(nonGroupedColumns, nestedRow);
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

    renderGroupedColumns(row) {
        let tds = [];
        let parent = row.parent;
        while (parent != null) {
            if (!parent.done) {
                tds.push(<td key={_.uniqueId()} rowSpan={parent.rowSpan}>{parent.value}</td>);
                parent.done = true;
            }
            parent = parent.parent;
        }
        return tds.reverse();
    }

    renderNonGroupedColumns(nonGroupedColumns, row) {
        return nonGroupedColumns.map((nonGroupedCol) => {
            return (<td key={_.uniqueId()}>{row[nonGroupedCol.key]}</td>);
        });
    }

    renderRow(nonGroupedColumns, row) {
        if (_.has(row, 'nested')) {
            return row.nested.map((nestedRow) => {
                return this.renderRow(nonGroupedColumns, nestedRow);
            });
        } else {
            let groupedTds = this.renderGroupedColumns(row);
            let nonGroupedTds = this.renderNonGroupedColumns(nonGroupedColumns, row);
            let tds = _.union(groupedTds, nonGroupedTds);

            return (<tr key={_.uniqueId()}>{tds}</tr>);
        }
    }

}

GroupedTableBody.propTypes = {
  data: React.PropTypes.array.isRequired,
  columns: React.PropTypes.array.isRequired
}

export default GroupedTableBody;