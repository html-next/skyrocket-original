import Ember from 'ember';
import Transport from './metal/transport';

export default Ember.Object.extend({
  _isWorkerInterfaceFactory: true,
  transport: null,

  init() {
    this._super();
    this.transport = new Transport();
  }
});
