import Ember from "ember";

// ensures our POJOs always have the same structure
function makeMessage(type, name, args) {

  return {
    type: type,
    name: name,
    args: Array.prototype.slice.call(args)
  }

}

export default Ember.Object.extend(Ember.Evented, {

  // same as the file name, used to generate the worker's
  // source URL or to lookup the fallback
  _interfaceName: null,

  _workerFeatures: inject.service('worker-features'),

  // currently outstanding requests
  __requests: [],

  // send data to the worker
  __pipeData: function(message) {



  },


  // this will be either an actual worker or the fallback
  __worker: null,


  // tear down worker as needed
  willDestroy: function() {
    if (this.__worker) {
      this.__worker.terminate();
    }
    this._super();
  },

  init: function() {
    this._super();
  }

});

