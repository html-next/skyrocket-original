import Global from './utils/global';

const SYSTEM_TYPE = '-worker';
let REQUEST_INC = 0;

export default class Transport {

  constructor(src, options) {
    this.src = src || Global;
    this.isMaster = !!src;
    this.isWorker = !src;
    this.options = options;

    this.callbacks = new WeakMap();

    this.connect();
  }

  _idFor(request) {
    if (!request.__rid) {
      request.__rid = `${this.isWorker ? 'W' : 'M'}:${SYSTEM_TYPE}-${Date.now()}-${REQUEST_INC++}`;
    }
    return request.__rid;
  }

  connect() {
    // send ping
    this.src.addEventListener('message', (...args) => {
      this._receive(...args);
    });
  }

  registerEvent() {}

  registerTask() {}








  send() {
    this._send({

    });
  }

  sendWithCallback(...args) {
    let cb = args.pop();
    let req = {
      data: args
    };
    let id = this._idFor(req);

    this._registerCallback(id, cb);
    this._send(req);
  }

  _send() {
    this.src.postMessage(...arguments);
  }

  _receive(event) {

  }

  _registerCallback(id, callback) {
    this.callbacks.set(id, {
      id,
      callback,
      startTime: Date.now()
    });
  }

}
