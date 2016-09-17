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
    this.workerTree = workerTree.call(this, this._trueApp);
    return this.workerTree;
  },

  contentFor: function(type, config, content) {
    if(type === 'body-footer') {
      var bodyFooterContent = '';
      var workerNames = this.workerTree.workerNames;
      for(var i=0, l=workerNames.length; i<l; i++) {
        bodyFooterContent += '<script src="assets/workers/' + workerNames[i] + '.js"></script>';
      }
      this.ui.writeLine(bodyFooterContent);
      return bodyFooterContent;
    }
    return '';
  }

};
