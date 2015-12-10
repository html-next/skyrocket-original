/* global self */
import Ember from 'ember';

// Further Reading
// https://developer.mozilla.org/en-US/docs/Web/API/Worker/Functions_and_classes_available_to_workers
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
// https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent

export default Ember.Service.extend({

  // the best available transport should be used
  transfers: {

    // Can data be transferred by string
    string: true, // poor

    // Can data be transferred as JSON objects
    jsonPayloads: false, // good

    // Can data be transferred via structured cloning
    structuredCloning: false, // better

    // Can data be transferred via transferable objects
    transferableObjects: false // best!

  },

  // Can the worker utilize a websocket
  webSockets: false,

  // Can the worker utilize Fetch
  fetch: false,

  // Are Shared Workers available
  sharedWorkers: false,

  // Are Dedicated Workers available
  dedicatedWorkers: false,

  // is localStorage available
  localStorage: false,

  // global (may be in a worker already
  global: typeof window === 'undefined' ? self : window,

  isWorker: typeof window === 'undefined',

  detectFeatures() {
    const { global } = this;

    // simple detection
    this.setProperties({
      dedicatedWorkers: Boolean(global.Worker),
      sharedWorkers: Boolean(global.SharedWorker),
      localStorage: Boolean(global.localStorage),
      webSockets: Boolean(global.WebSocket)
    });

    // transfer abilities detection
    const testWorker = new Worker('/assets/workers/worker-features.js');

    // check JSON transfer
    try {
      testWorker.postMessage({
        hello: 'world'
      });
      this.set('transfers.jsonPayloads', true);
    } catch (e) {
      // Worker does not support anything but strings
      return;
    }

    // detect ability to use Transferable Objects
    // bonobo.js does a decent feature detection job
    // https://github.com/f5io/bonobo-js/blob/master/lib/bonobo.js
    // https://github.com/f5io/bonobo-js/blob/v2.2.0/dist/bonobo.js
    if (typeof ArrayBuffer !== 'undefined') {
      try {
        const ab = new ArrayBuffer(1);

        testWorker.postMessage(ab, [ab]);
        if (!ab.byteLength) {
          this.set('transfers.transferableObjects', true);
        } else {
          this.set('transfers.structuredCloning', true);
        }
      } catch (e) {
        // neither algorithm is available
      }

    }

  },

  init() {
    this.detectFeatures();
    this._super();
  }

});
