const baseStyle = {
  bottom: '0',
  left: '15%',
  padding: '10px 10px 25px 10px',
  position: 'absolute',
  right: '15%',
  width: '70%',
  zIndex: 40
};

const HermesStyles = {

  info: Object.assign({}, baseStyle, {backgroundColor: 'rgba(176,190,197,.8)'}),

  error: Object.assign({}, baseStyle, {backgroundColor: 'rgba(211,47,47,.8)'}),

  success: Object.assign({}, baseStyle, {backgroundColor: 'rgba(76,175,80,.8)'}),

  notice: Object.assign({}, baseStyle, {backgroundColor: 'rgba(41,182,246,.8)'})

};

export default HermesStyles;