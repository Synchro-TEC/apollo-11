'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign2 = require('lodash/assign');

var _assign3 = _interopRequireDefault(_assign2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionsBaseStyle = {
  border: '1px solid #e5e5e5',
  paddingLeft: '5px',
  paddingRight: '5px'
};

var PaginateStyles = {
  list: { display: 'inline-flex' },
  options: optionsBaseStyle,
  gapOption: (0, _assign3.default)({}, optionsBaseStyle, { paddingLeft: '10px', paddingRight: '10px', fontSize: '1.2rem' }),
  gap: { color: '#d3d3d3', backgroundColor: '#fafafa' }
};

exports.default = PaginateStyles;