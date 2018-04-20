import Ember from 'ember';
import workerManifest from '../worker-manifest';
import WorkerTransport from 'skyrocket/worker-transport';

const {
  Service
} = Ember;

export default Service.extend({
  init() {
    this._super();
    this._instanceCache = Object.create(null);
  },

  lookup(workerName) {
    return this.lookupTransport(workerName).proxy;
  },

  lookupTransport(workerName) {
    const cache = this._instanceCache;
    let worker = cache[workerName];

    if (worker === undefined) {
      const schema = this.schemaFor(workerName);
      worker = cache[workerName] = new WorkerTransport(schema);
    }

    return worker;
  },

  schemaFor(workerName) {
    let schema = workerManifest[workerName];

    // TODO assert

    return schema;
  }
});
