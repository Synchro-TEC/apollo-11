import React from 'react';
import Update from 'react-addons-update';
import HermesAPI from './HermesApi';
import HermesMessageItem from './HermesMessageItem';
import HermesStyles from './HermesStyles';
import HermesConstantes from './HermesConstants';
import uuid from 'uuid';
import classNames from 'classnames';

var _hideTimeOut;
class Hermes extends React.Component {

  static addMessage(msg, isDeletable = false) {
    HermesAPI.addMessage(uuid.v1(), msg, isDeletable);
  }

  static setContext(newContext) {
    HermesAPI.setContext(newContext);
  }

  static setPosition(newPosition) {
    HermesAPI.setPosition(newPosition);
  }

  static setTitle(newTitle) {
    HermesAPI.setTitle(newTitle);
  }

  static clearMessages() {
    HermesAPI.clearMessages();
  }

  constructor(props) {
    super(props);

    this.state = {
      autoClose: this.props.autoClose,
      autoCloseInMiliseconds: this.props.autoCloseInMiliseconds,
      context: this.props.context,
      messages: [],
      position: this.props.position,
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
      position: {$set: HermesAPI.position || this.props.position},
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

  hide() {
    clearTimeout(_hideTimeOut);
    let newState = Update(this.state, {
      visible: {$set: false}
    });
    HermesAPI.clearMessages();
    this.setState(newState);
  }

  render() {

    let createMessage = function(message) {
      return <HermesMessageItem key={message.id} message={message} />;
    };

    let visible = this.state.visible ? 'block' : 'none';
    const display = {display: visible};
    let cssClasses = classNames('sv-messagebox sv-no-margins', this.state.context);
    const styles = Object.assign({}, display, HermesStyles[this.state.position]);


    return (
      <div className={cssClasses} style={styles}>
        <button className='sv-messagebox__close' onClick={() => this.hide()}>&times;</button>
        <header>
          <h6>{this.state.title}</h6>
        </header>
        <main>
          <ul style={HermesStyles.msgListStyle}>
            {this.state.messages.map(createMessage)}
          </ul>
        </main>
      </div>
    );
  }
}


Hermes.defaultProps = {
  autoClose: true,
  autoCloseInMiliseconds: 10000,
  context: 'info',
  position: 'bottom',
  title: ''
};

Hermes.propTypes = {
  autoClose: React.PropTypes.bool,
  autoCloseInMiliseconds: React.PropTypes.number,
  context: React.PropTypes.oneOf(HermesConstantes.allowedContexts).isRequired,
  position: React.PropTypes.oneOf(HermesConstantes.allowedPositions),
  title: React.PropTypes.string
};

Hermes.displayName = 'Hermes';

export default Hermes;
