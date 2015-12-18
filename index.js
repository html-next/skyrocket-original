/* jshint node: true */
'use strict';
var path = require('path');

module.exports = {
  name: 'skyrocket',

  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    this._super.included.call(this, app);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    var pathToRuntime = path.join(app.bowerDirectory, 'ember/ember-runtime.js');

    app.import(pathToRuntime, {
      exports: {
        'ember-runtime': [
          'exports',
          'ember-metal',
          'ember-runtime/is-equal',
          'ember-runtime/compare',
          'ember-runtime/copy',
          'ember-runtime/inject',
          'ember-runtime/system/namespace',
          'ember-runtime/system/object',
          'ember-runtime/system/container',
          'ember-runtime/system/array_proxy',
          'ember-runtime/system/object_proxy',
          'ember-runtime/system/core_object',
          'ember-runtime/system/native_array',
          'ember-runtime/system/string',
          'ember-runtime/system/lazy_load',
          'ember-runtime/mixins/array',
          'ember-runtime/mixins/comparable',
          'ember-runtime/mixins/copyable',
          'ember-runtime/mixins/enumerable',
          'ember-runtime/mixins/freezable',
          'ember-runtime/mixins/-proxy',
          'ember-runtime/mixins/observable',
          'ember-runtime/mixins/action_handler',
          'ember-runtime/mixins/mutable_enumerable',
          'ember-runtime/mixins/mutable_array',
          'ember-runtime/mixins/target_action_support',
          'ember-runtime/mixins/evented',
          'ember-runtime/mixins/promise_proxy',
          'ember-runtime/computed/reduce_computed_macros',
          'ember-runtime/controllers/controller',
          'ember-runtime/mixins/controller',
          'ember-runtime/system/service',
          'ember-runtime/ext/rsvp',
          'ember-runtime/ext/string',
          'ember-runtime/ext/function',
          'ember-runtime/utils',
          'ember-metal/features',
          'ember-runtime/mixins/registry_proxy',
          'ember-runtime/mixins/container_proxy',
          'ember-runtime/string_registry'
        ]
      }
    });

  }

};
