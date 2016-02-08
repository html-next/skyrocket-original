/* jshint node: true */
'use strict';
var workerTree = require('./lib/worker-tree');

module.exports = {
  name: 'skyrocket',

  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this._trueApp = app;
    return app;
  },

  treeForPublic: function() {
    return workerTree.call(this, this._trueApp);
  }

};
