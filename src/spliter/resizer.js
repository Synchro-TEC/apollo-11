import React from 'react';

const Resizer = ({onMouseDown, split}) => {
  const classes = ['Resizer', split];

  return (<span className={classes.join(' ')} onMouseDown={(e) => onMouseDown(e)} />);
};

Resizer.displayName = 'Resizer';

export default Resizer;
