import React from 'react';
import PropTypes from 'prop-types';
import v4 from 'uuid/v4';
import Cell from './Cell';

class TableBody extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let trs = this.props.data.map((row, i) => {
      return (
        <tr key={i} style={{ height: '40px' }}>
          {this.props.columns.map((col) => {
            return (<Cell col={col} key={v4()} row={row} />);
          })}
        </tr>
      );
    });

    return (<tbody>{trs}</tbody>);
  }
}

TableBody.displayName = 'TableBody';

TableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default TableBody;