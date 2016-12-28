'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = require('events');

var _HermesConstants = require('./HermesConstants');

var _HermesConstants2 = _interopRequireDefault(_HermesConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hermesAPI = _extends({}, _events.EventEmitter.prototype, {
  messages: [],
  title: '',
  context: '',
  position: '',

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
    if (_HermesConstants2.default.allowedContexts.indexOf(context) >= 0) {
      this.context = context;
      this.emitChange();
    } else {
      throw TypeError(context + ' is not allowed, context should be on of ' + _HermesConstants2.default.allowedContexts.toString() + '.');
    }
  },
  setPosition: function setPosition(position) {
    if (_HermesConstants2.default.allowedPositions.indexOf(position) >= 0) {
      this.position = position;
      this.emitChange();
    } else {
      throw TypeError(position + ' is not allowed, position should be on of ' + _HermesConstants2.default.allowedPositions.toString() + '.');
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

exports.default = hermesAPI;