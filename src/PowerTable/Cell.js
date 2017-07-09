import React from 'react';
import PropTypes from 'prop-types';

const Cell = ({ col, row, width }) => {
  let style = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: width,
  };

  let rendered = col.formatter ? col.formatter(row) : row[col.key];

  return (
    <td style={style}>
      {rendered}
    </td>
  );
};

Cell.displayName = 'Cell';

Cell.propTypes = {
  col: PropTypes.any,
  row: PropTypes.any,
  width: PropTypes.string,
};

export default Cell;
