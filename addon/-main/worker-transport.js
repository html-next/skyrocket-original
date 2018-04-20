import Ember from 'ember';
import WorkerProxy from './worker-proxy';
import assert from 'skyrocket/-debug';

const {
  run,
  propertyDidChange
} = Ember;

const SYSTEM_QUERY_TYPE = '-system-query';

export default class WorkerTransport {
  constructor(schema) {
    this.meta = Object.create(null);
    this.proxy = new WorkerProxy(schema);
    this.src = meta.src || `./assets/${schema.moduleName}.js`;
    this.worker = new Worker(this.src);
    this.events = Object.create(null);

    this.__ready = null;
    this.initWorker();
  }

  initWorker() {
    return new Promise((resolve, reject) => {
      const worker = this.worker;

      worker.onmessage = () => {
        this.setupWorkerHandler();
        resolve();
      };
    });
  }

  setupWorkerHandler() {
    this.worker.onmessage = (msg, opts) => {
      this.receiveData(msg, opts);
    };
  }

  receiveData(msg, opts) {
    throw new Error('not implemented');
  }

  sendData(data, buffers) {
    if (buffers) {
      this.worker.postMessage(data, buffers);
    } else {
      this.worker.postMessage(data);
    }
  }

  triggerEvent(name, event) {
    const handlers = this.events[name];

    if (Array.isArray(handlers)) {
      run.join(() => {
        for (let i = 0; i < handlers.length; i++) {
          handlers[i](event);
        }
      });
    }
  }

  setProperty(name, value) {
    assert(`Cannot set property, not a valid schema property`, this.schema.prop && this.schema.prop.indexOf(name) !== -1);
    this.meta[name] = value;
    this.notifyProxy(name);
  }

  notifyProxy(name) {
    run.join(() => {
      propertyDidChange(this.proxy, name);
    });
  }

  detectFeatures() {
    const _test = this;

    return new Promise((resolve) => {
      const features = {
        strings: true,
        json: false,
        cloning: false,
        transfer: false,
        channels: false
      };

      // check JSON transfer
      try {
        _test._send({
          type: SYSTEM_QUERY_TYPE,
          name: 'json-transfer',
          data: { name: 'JSON usability test' }
        });
        features.json = true;
      } catch (e) {
        // Worker does not support anything but strings
      }

      if (features.json) {
        //detect Structured Cloning and Transferable Objects
        if (typeof ArrayBuffer !== 'undefined') {
          try {
            const ab = new ArrayBuffer(1);

            _test._send({
              type: SYSTEM_QUERY_TYPE,
              name: 'buffer-transfer',
              data: ab
            }, [ab]);

            // if the byteLength is 0, the content of the buffer was transferred
            features.transfer = !ab.byteLength;
            features.cloning = !features.transfer;

          } catch (e) {
            // neither feature is available
          }
        }
      }

      // check channels
      if (typeof MessageChannel !== 'undefined') {
        features.channels = true;
      }

      resolve(features);
    });
  }
}
