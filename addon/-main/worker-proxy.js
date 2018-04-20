import Transport from './worker-transport';

function define(context, meta, type, name) {
  switch (type) {
    case 'method':
      Object.defineProperty(context, name, {
        enumerable: true,
        writable: false,
        configurable: false,
        value(...args) {
          return context._transport.expect(['method', name, args]);
        }
      });
      break;

    case 'signal':
      Object.defineProperty(context, name, {
        enumerable: true,
        writable: false,
        configurable: false,
        value(...args) {
          context._transport.send(['signal', name, args]);
        }
      });
      break;

    case 'prop':
      meta.props[name] = null;
      Object.defineProperty(context, name, {
        enumerable: true,
        writable: false,
        configurable: false,
        get() {
          return meta.props[name];
        }
      });
      break;

    default:
      break;
  }
}

export default class WorkerManager {
  constructor(transport) {
    this._transport = transport;

    const { schema, meta } = transport;

    if (schema.method) {
      for (let i = 0; i < schema.method.length; i++) {
        let method = schema.method[i];
        define(this, meta, 'method', method);
      }
    }

    if (schema.signal) {
      for (let i = 0; i < schema.signal.length; i++) {
        let signal = schema.signal[i];
        define(this, meta, 'signal', signal);
      }
    }

    if (schema.prop) {
      meta.props = Object.create(null);
      for (let i = 0; i < schema.prop.length; i++) {
        let prop = schema.prop[i];
        define(this, meta, 'prop', prop);
      }
    }
  }

  subscribe(eventName, handler, token) {
    // TODO validate eventName is valid
    let handlers = this._transport.events[eventName] = this._transport.events[eventName] || [];
    handlers.push(handler, token);
  }

  unsubscribe(eventName, handler) {
    if (handler) {
      let handlers = this._transport.events[eventName] = this._transport.events[eventName] || [];
      let index = handlers.indexOf(handler);

      if (index !== -1) {
        handlers.splice(index, 2);
      } else {
        throw new Error('Unable to unsubscribe unknown handler');
      }
    } else {
      this._transport.events[eventName] = [];
    }
  }

  trigger(eventName, event) {
    // TODO validate eventName is valid
    this._transport.send(['event', eventName, event]);
  }
}
