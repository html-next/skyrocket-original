/* jshint node: true */
'use strict';
var path = require('path');

// var Funnel = require('broccoli-funnel');
// var mergeTrees = require('broccoli-merge-trees');

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

    this.includeEmberRuntime(app);
    return app;
  },

  includeEmberRuntime: function(app) {
    //var pathToRuntime = path.join(this.treePaths.vendor, 'ember-runtime/ember-runtime.js');
    //app.import(pathToRuntime);
  },

  treeForVendor: function(vendorTree) {
    return vendorTree;
    /*
    var trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    var pathToEmber = path.join(this.project.bowerDirectory, 'ember');

    trees.push(new Funnel(pathToEmber, {
      destDir: 'ember-runtime',
      include: ['ember-runtime.js']
    }));

    return mergeTrees(trees);
    */
  }

};
