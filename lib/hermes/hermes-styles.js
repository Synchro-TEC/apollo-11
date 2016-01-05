'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var baseStyle = {
  bottom: '0',
  left: '15%',
  fontFamily: 'inherit',
  maxHeight: '300px',
  padding: '10px 10px 25px 10px',
  position: 'absolute',
  right: '15%',
  width: '70%',
  zIndex: 40
};

var baseButtonStyle = {
  backgroundColor: 'Transparent',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '1.2em',
  height: '1em',
  outline: 'none',
  padding: '0'
};

var HermesStyles = {
  info: Object.assign({}, baseStyle, { backgroundColor: 'rgba(176,190,197,.9)' }),
  error: Object.assign({}, baseStyle, { backgroundColor: 'rgba(211,47,47,.9)' }),
  success: Object.assign({}, baseStyle, { backgroundColor: 'rgba(76,175,80,.9)' }),
  notice: Object.assign({}, baseStyle, { backgroundColor: 'rgba(41,182,246,.9)' }),
  closeButtonHermes: Object.assign({}, baseButtonStyle, { position: 'absolute', right: '10px', top: '3px' }),
  closeButtonMessage: Object.assign({}, baseButtonStyle, { fontSize: '1em', margin: '0 5px' }),
  msgListStyle: { listStyle: 'none', maxHeight: '240px', overflow: 'auto' },
  msgStyle: { margin: '3px' }
};

exports.default = HermesStyles;