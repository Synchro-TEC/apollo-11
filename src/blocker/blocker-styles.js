const blockerDefaultStyles = {
  backgroundDefaultStyle: {
    display: 'block',
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10
  },

  foregroundDefaultStyle: {
    display: 'table',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    zIndex: 20,
    color: 'white'
  },

  messageDefaultStyle: {
    display: 'table-cell',
    verticalAlign: 'middle'
  }

};

export default blockerDefaultStyles;
