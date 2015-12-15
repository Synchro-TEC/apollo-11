import { EventEmitter } from 'events';

const hermesAPI = {...EventEmitter.prototype,
  messages: [],
  title: '',
  context: '',
  allowedContexts: ['info', 'error', 'success', 'notice'],

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
    if(this.allowedContexts.indexOf(context) >= 0) {
      this.context = context;
      this.emitChange();
    } else {
      throw TypeError(`${context} is not allowed, context should be on of ${this.allowedContexts.toString()}.`);
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
