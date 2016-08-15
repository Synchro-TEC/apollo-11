var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { EventEmitter } from 'events';

var hermesAPI = _extends({}, EventEmitter.prototype, {
  messages: [],
  title: '',
  context: '',
  allowedContexts: ['info', 'error', 'success', 'notice'],

  addMessage: function addMessage(id, message, isDeletable) {
    if (this.getIndex(id) === -1) {
      this.messages.push({ id: id, text: message, isDeletable: isDeletable });
      this.emitChange();
    }
  },
  removeMessage: function removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.messages.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  clearMessages: function clearMessages() {
    this.messages = [];
    this.emitChange();
  },
  setContext: function setContext(context) {
    if (this.allowedContexts.indexOf(context) >= 0) {
      this.context = context;
      this.emitChange();
    } else {
      throw TypeError(context + ' is not allowed, context should be on of ' + this.allowedContexts.toString() + '.');
    }
  },
  setTitle: function setTitle(title) {
    this.title = title;
    this.emitChange();
  },
  getIndex: function getIndex(id) {
    return this.messages.findIndex(function (loader) {
      return loader.id === id;
    });
  },
  emitChange: function emitChange() {
    this.emit('change');
  },
  addChangeListener: function addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
});

export default hermesAPI;