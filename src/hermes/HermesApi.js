import { EventEmitter } from 'events';
import HermesConstantes from './HermesConstants';

const hermesAPI = {...EventEmitter.prototype,
  messages: [],
  title: '',
  context: '',
  position: '',

  addMessage(id, message, isDeletable) {
    if (this.getIndex(id) === -1) {
      this.messages.push({id: id, text: message, isDeletable: isDeletable});
      this.emitChange();
    }
  },

  removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.messages.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },

  clearMessages() {
    this.messages = [];
    this.emitChange();
  },

  setContext(context) {
    if(HermesConstantes.allowedContexts.indexOf(context) >= 0) {
      this.context = context;
      this.emitChange();
    } else {
      throw TypeError(`${context} is not allowed, context should be on of ${HermesConstantes.allowedContexts.toString()}.`);
    }
  },

  setPosition(position) {
    if(HermesConstantes.allowedPositions.indexOf(position) >= 0) {
      this.position = position;
      this.emitChange();
    } else {
      throw TypeError(`${position} is not allowed, position should be on of ${HermesConstantes.allowedPositions.toString()}.`);
    }
  },

  setTitle(title) {
    this.title = title;
    this.emitChange();
  },

  getIndex(id) {
    return this.messages.findIndex(loader => loader.id === id);
  },

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

};

export default hermesAPI;
