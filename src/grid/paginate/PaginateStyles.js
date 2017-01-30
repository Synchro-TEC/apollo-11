import _assign from 'lodash/assign';

const optionsBaseStyle = {
  border: '1px solid #e5e5e5',
  paddingLeft: '5px',
  paddingRight: '5px'
};

const PaginateStyles = {
  list: {display: 'inline-flex'},
  options: optionsBaseStyle,
  optionSelected: {fontWeight: 'bold', color: '#455a64'},
  gapOption: _assign({}, optionsBaseStyle, {paddingLeft: '10px', paddingRight: '10px', fontSize: '1.2rem'}),
  gap: {color: '#d3d3d3', backgroundColor: '#fafafa'}
};

export default PaginateStyles;
