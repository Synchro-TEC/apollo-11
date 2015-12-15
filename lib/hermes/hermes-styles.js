'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var baseStyle = {
  padding: '10px',
  zIndex: 10
};

var HermesStyles = {

  info: Object.assign(baseStyle, {
    backgroundColor: 'rgba(176,190,197,1)'
  }),

  error: Object.assign(baseStyle, {
    backgroundColor: 'rgba(211,47,47,1)'
  }),

  success: Object.assign(baseStyle, {
    backgroundColor: 'rgba(76,175,80,1)'
  }),

  notice: Object.assign(baseStyle, {
    backgroundColor: 'rgba(41,182,246,1)'
  })

};

exports.default = HermesStyles;