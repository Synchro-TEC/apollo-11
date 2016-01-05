import React from 'react';
import Update from 'react-addons-update';
import HermesAPI from './hermes-api';
import Message from './message';
import HermesStyles from './hermes-styles';
import uuid from 'uuid';

var _hideTimeOut;
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
    HermesAPI.addChangeListener(this.onStackChange);
  }

  componentWillUnmount() {
    HermesAPI.removeChangeListener(this.onStackChange);
  }

  onStackChange() {
    let newState = Update(this.state, {
      context: {$set: HermesAPI.context || this.props.context},
      messages: {$set: HermesAPI.messages},
      title: {$set: HermesAPI.title || this.props.title},
      visible: {$set: HermesAPI.messages.length}
    });
    this.setState(newState);
    if(_hideTimeOut) {
      clearTimeout(_hideTimeOut);
    }

    _hideTimeOut = setTimeout(() => {
      if(this.state.autoClose && this.state.visible) {
        this.hide();
      }
    }, this.state.autoCloseInMiliseconds);
  }

  static addMessage(msg, isDeletable = false) {
    HermesAPI.addMessage(uuid.v1(), msg, isDeletable);
  }

  static setContext(newContext) {
    HermesAPI.setContext(newContext);
  }

  static setTitle(newTitle) {
    HermesAPI.setTitle(newTitle);
  }

  static clearMessages() {
    HermesAPI.clearMessages();
  }

  hide() {
    clearTimeout(_hideTimeOut);
    let newState = Update(this.state, {
      visible: {$set: false}
    });
    HermesAPI.clearMessages();
    this.setState(newState);
  }

  render() {

    var createMessage = function(message) {
      return <Message key={message.id} message={message} />;
    };

    var visible = this.state.visible ? 'block' : 'none';

    const display = {display: visible};
    const styles = Object.assign({}, display, HermesStyles[this.state.context]);

    return (
      <div style={styles}>
        <h3>{this.state.title}<button onClick={() => this.hide()} style={HermesStyles.closeButtonHermes}>&times;</button></h3>
        <ul style={HermesStyles.msgListStyle}>
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
  context: React.PropTypes.oneOf(['info', 'error', 'success', 'notice']).isRequired,
  styles: React.PropTypes.object,
  title: React.PropTypes.string
};

Hermes.displayName = 'Hermes';

export default Hermes;
