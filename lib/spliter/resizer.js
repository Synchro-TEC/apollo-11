import React from 'react';

var Resizer = function Resizer(_ref) {
  var _onMouseDown = _ref.onMouseDown;
  var split = _ref.split;

  var classes = ['Resizer', split];

  return React.createElement('span', { className: classes.join(' '), onMouseDown: function onMouseDown(e) {
      return _onMouseDown(e);
    } });
};

Resizer.displayName = 'Resizer';

export default Resizer;