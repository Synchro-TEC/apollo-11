'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var baseStyle = {
  left: '15%',
  fontFamily: 'inherit',
  maxHeight: '300px',
  padding: '10px 10px 25px 10px',
  position: 'fixed',
  right: '15%',
  width: '70%',
  zIndex: 99
};

var HermesStyles = {
  top: Object.assign({}, baseStyle, { top: '0px' }),
  bottom: Object.assign({}, baseStyle, { bottom: '0px' }),
  msgListStyle: { listStyle: 'none', maxHeight: '240px', overflow: 'auto' },
  msgStyle: { margin: '3px' }
};

exports.default = HermesStyles;