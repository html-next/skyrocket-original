import Ember from 'ember';

const {
  inject
  } = Ember;

export default Ember.Object.extend({
  'interface': null,
  _isWorkerFactory: true,

  _features: inject.service('worker-features'),

  _connect() {},

  init() {
    this._super();
    if (this.initialize && typeof this.initialize === 'function') {
      this.initialize();
    }
  }

});
