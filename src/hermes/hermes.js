import React from 'react';

class Hermes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  componentDidMount() {}


  componentWillUnmount() {}

  render() {

    var createMessage = function(message, i) {
      return <li key={i}>{message.text}</li>;
    };

    return (
      <div>
        <h3>{this.props.title}</h3>
        <ul>
          {this.props.messages.map(createMessage)}
        </ul>
      </div>
    );
  }
}
Hermes.defaultProps = {
  messages: []
};

Hermes.propTypes = {
  title: React.PropTypes.string,
  messages: React.PropTypes.arrayOf(React.PropTypes.shape({text: React.PropTypes.string.isRequired})),
  context: React.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired
};


Hermes.displayName = 'Hermes';

export default Hermes;
