import findMax from 'lodash.max';
import { EventEmitter } from 'events';

const blockerStack = {...EventEmitter.prototype,
  stack: [],
  addLoader(id, priority = 0) {
    if (this.getIndex(id) === -1) {
      this.stack.push({id, priority});
      this.emitChange();
    }
  },
  removeLoader(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  getIndex(id) {
    return this.stack.findIndex(loader => loader.id === id);
  },
  getMaxPriority() {
    const max = findMax(this.stack, loader => loader.priority);
    return max ? max.priority : 0;
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

export default blockerStack;