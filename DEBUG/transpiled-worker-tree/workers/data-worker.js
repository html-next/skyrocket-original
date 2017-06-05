var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

import { event, method, signal, prop } from 'skyrocket/decorators';

var DataWorker = (_class = function () {
  function DataWorker() {
    this._x = 1;
  }

  DataWorker.prototype.query = function query(modelName, options) {
    return Promise.resolve({
      data: {
        type: modelName,
        id: '1',
        attributes: {
          name: 'Chris Thoburn'
        }
      }
    });
  };

  _createClass(DataWorker, [{
    key: 'x',
    get: function get() {
      return this._x;
    },
    set: function set(x) {
      this._x = x;
      this._y = 2 * x;
      return this._x;
    }
  }, {
    key: 'y',
    get: function get() {
      return this._y;
    }
  }]);

  return DataWorker;
}(), (_applyDecoratedDescriptor(_class.prototype, 'query', [method], Object.getOwnPropertyDescriptor(_class.prototype, 'query'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'x', [prop], Object.getOwnPropertyDescriptor(_class.prototype, 'x'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'y', [prop], Object.getOwnPropertyDescriptor(_class.prototype, 'y'), _class.prototype)), _class);
export { DataWorker as default };