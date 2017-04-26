import React from 'react';
import _ from 'lodash';


class TableBody extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let trs = this.props.data.map((row, i) => {
            return (
                <tr key={i} style={{ height: '40px' }}>
                    {this.props.columns.map((col) => { 
                        return <Cell key={_.uniqueId()} col={col} row={row} /> 
                    })}
                </tr>
            );
        });

        return (<tbody>{trs}</tbody>);
    }

}

const Cell = ({ col, row }) => {
    let style = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    let rendered = col.formatter ? col.formatter(row) : row[col.key];

    return (<td style={style}>{rendered}</td>);
}

TableBody.propTypes = {
    data: React.PropTypes.array.isRequired,
    columns: React.PropTypes.array.isRequired
}

export default TableBody;