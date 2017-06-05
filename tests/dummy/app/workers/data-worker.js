import {
  event,
  method,
  signal,
  prop
} from 'skyrocket/decorators';

export default class DataWorker {
  constructor() {
    this._x = 1;
  }

  @method
  query(modelName, options) {
    return Promise.resolve({
      data: {
        type: modelName,
        id: '1',
        attributes: {
          name: 'Chris Thoburn'
        }
      }
    });
  }

  @prop
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
    this._y = 2 * x;
    return this._x;
  }

  @prop
  get y() {
    return this._y;
  }
}

