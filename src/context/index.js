import React from 'react';
import PropTypes from 'prop-types';

class ContextChange extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div
        className="sv-ph--20"
        style={{
          height: '34px',
          lineHeight: '34px',
          position: 'fixed',
          width: '100%',
          top: '80px',
          backgroundColor: this.props.bgColor,
        }}
      >
        Estabelecimento
      </div>
    );
  }
}

ContextChange.displayName = 'ContextChange';

ContextChange.defaultProps = {
  bgColor: '#dcdcdc',
};

ContextChange.propTypes = {
  bgColor: PropTypes.string,
};

export default ContextChange;
