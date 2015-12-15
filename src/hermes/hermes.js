import React from 'react';
import Update from 'react-addons-update';
import MessageStack from './message-stack';
import Message from './message';
import uuid from 'uuid';

class Hermes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      autoClose: this.props.autoClose,
      autoCloseInMiliseconds: this.props.autoCloseInMiliseconds,
      context: this.props.context,
      messages: [],
      title: this.props.title,
      visible: false
    };

    this.onStackChange = this.onStackChange.bind(this);
  }

  componentDidMount() {
    MessageStack.addChangeListener(this.onStackChange);
  }

  componentWillUnmount() {
    MessageStack.removeChangeListener(this.onStackChange);
  }

  onStackChange() {

    let newState = Update(this.state, {
      context: {$set: MessageStack.context},
      messages: {$set: MessageStack.stack},
      title: {$set: MessageStack.title},
      visible: {$set: MessageStack.stack.length}
    });

    this.setState(newState);

    setTimeout(() => {
      if(this.state.autoClose && this.state.visible) {
        this.hide();
      }
    }, this.state.autoCloseInMiliseconds);

  }

  static addMessage(msg, isDeletable = false) {
    MessageStack.addMessage(uuid.v1(), msg, isDeletable);
  }

  static setContext(newContext) {
    MessageStack.setContext(newContext);
  }

  static setTitle(newTitle) {
    MessageStack.setTitle(newTitle);
  }

  hide() {
    let newState = Update(this.state, {
      visible: {$set: false}
    });
    this.setState(newState);
  }

  render() {

    var createMessage = function(message) {
      return <Message key={message.id} message={message} />;
    };

    var visible = this.state.visible ? 'block' : 'none';

    return (
      <div style={{display: visible}}>
        <h3>{this.state.title || 'Messages:'}<button onClick={() => this.hide()}>&times;</button></h3>

        <ul>
          {this.state.messages.map(createMessage)}
        </ul>
      </div>
    );
  }
}
Hermes.defaultProps = {
  autoClose: true,
  autoCloseInMiliseconds: 10000,
  context: 'info',
  title: ''
};

Hermes.propTypes = {
  autoClose: React.PropTypes.bool,
  autoCloseInMiliseconds: React.PropTypes.number,
  title: React.PropTypes.string,
  context: React.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired
};

Hermes.displayName = 'Hermes';

export default Hermes;
