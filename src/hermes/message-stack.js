import { EventEmitter } from 'events';

const messageStack = {...EventEmitter.prototype,
  stack: [],
  title: '',
  context: '',

  addMessage(id, message, isDeletable) {
    if (this.getIndex(id) === -1) {
      this.stack.push({id: id, text: message, isDeletable: isDeletable});
      this.emitChange();
    }
  },

  removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },

  setContext(context) {
      this.context = context;
      this.emitChange();
  },

  setTitle(title) {
    this.title = title;
    this.emitChange();
  },

  removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },

  getIndex(id) {
    return this.stack.findIndex(loader => loader.id === id);
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

export default messageStack;
