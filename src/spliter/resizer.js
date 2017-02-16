import React from 'react';

const Resizer = ({onMouseDown}) => {
  const classes = ['Resizer'];

  return (<span className={classes.join(' ')} onMouseDown={(e) => onMouseDown(e)} />);
};

Resizer.displayName = 'Resizer';

Resizer.propTypes = {
  onMouseDown: React.PropTypes.func,
};

export default Resizer;
