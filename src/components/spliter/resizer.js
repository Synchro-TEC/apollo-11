import React from 'react';

const Resizer = ({onMouseDown}) => {
  const classes = ['Resizer'];

  return (<span className={classes.join(' ')} onMouseDown={(e) => onMouseDown(e)} />);
};

Resizer.propTypes = {
  onMouseDown: React.PropTypes.func,
};

Resizer.displayName = 'Resizer';

export default Resizer;
