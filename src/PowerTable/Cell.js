import React from 'react';
import PropTypes from 'prop-types';

const Cell = ({col, row}) => {
  let style = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  let rendered = col.formatter ? col.formatter(row) : row[col.key];

  return (<td style={style}>{rendered}</td>);
};

Cell.displayName = 'Cell';

Cell.propTypes = {
  col: PropTypes.any,
  row: PropTypes.any,
};

export default Cell;