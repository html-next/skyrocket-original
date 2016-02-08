/* global global, self, window */
import Ember from 'ember';

const {
  run
  } = Ember;

function ifDefined(o) {
  return typeof o !== 'undefined' ? o : false;
}

const GLOBAL_ENV = ifDefined(self) || ifDefined(global) || ifDefined(window);
const SYSTEM_TYPE = '-system';
const SYSTEM_QUERY = '-system-query';

export default class Transport {

  constructor(src, options) {
    this.src = src || GLOBAL_ENV;
    this.isMaster = !!src;
    this.isWorker = !src;
    this.options = options;

    this.connect();
    if (!options.skipDetection) {
      this.detectTransportFeatures();
    }

  }

  connect() {
    // send ping
    this.src.addEventListener('message', (...args) => {
      run.schedule('sync', () => {
        this._receive(...args);
      });
    });

    this.src.addEventListener('error', (...args) => {
      if (this.isWorker) {
        this.send({

        });
      } else {

      }
    });
  }

  send() {

  }

  _send() {
    this.src.postMessage(...arguments);
  }

  receive() {

  }

  detectTransportFeatures() {
    if (this.isMaster) {
      return;
    }

    const features = {
      json: false,
      cloning: false,
      transferable: false,
      channels: false
    };

    // check JSON transfer
    try {
      this._send({
        type: SYSTEM_QUERY,
        name: 'json-transfer',
        data: {name: 'JSON usability test'}
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

          this._send({
            type: SYSTEM_QUERY,
            name: 'buffer-transfer',
            data: ab
          }, [ab]);

          // if the byteLength is 0, the content of the buffer was transferred
          features.transferable = !ab.byteLength;
          features.cloning = !features.transferable;

        } catch (e) {
          // neither feature is available
        }
      }
    }

    // check channels
    if (ifDefined(MessageChannel)) {
      features.channels = true;
    }

    this.features.transport = features;
  }
}
