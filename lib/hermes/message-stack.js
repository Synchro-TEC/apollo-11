'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var messageStack = _extends({}, _events.EventEmitter.prototype, {
  stack: [],
  title: '',
  context: '',

  addMessage: function addMessage(id, message, isDeletable) {
    if (this.getIndex(id) === -1) {
      this.stack.push({ id: id, text: message, isDeletable: isDeletable });
      this.emitChange();
    }
  },
  removeMessage: function removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  setContext: function setContext(context) {
    this.context = context;
    this.emitChange();
  },
  setTitle: function setTitle(title) {
    this.title = title;
    this.emitChange();
  },
  removeMessage: function removeMessage(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  getIndex: function getIndex(id) {
    return this.stack.findIndex(function (loader) {
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

exports.default = messageStack;