import React from 'react';
import PropTypes from 'prop-types';

const Resizer = ({onMouseDown}) => {
  const classes = ['Resizer'];

  return (<span className={classes.join(' ')} onMouseDown={(e) => onMouseDown(e)} />);
};

Resizer.propTypes = {
  onMouseDown: PropTypes.func,
};

Resizer.displayName = 'Resizer';

export default Resizer;
