/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var versionChecker = require('ember-cli-version-checker');
var path = require('path');
var fs = require('fs');

var WorkerPreprocessor = require('./lib/worker-preprocessor');
var WorkerPostprocessor = require('./lib/worker-postprocessor');

module.exports = {
  name: 'ember-skyrocket'
/*
  shouldSetupRegistryInIncluded: function() {
    return !versionChecker.isAbove(this, '0.2.0');
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new WorkerPreprocessor({ addon: this }));
  },

  included: function(app) {
    monkeyPatch(app.constructor);

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }

    this.app = app;
    this.pod = {
      lookup: Object.create(null),
      styles: '',
      extension: ''
    };
  },

  postprocessTree: function(type, workingTree) {
    if (type === 'all') {
      return new WorkerPostprocessor(workingTree, { addon: this });
    }

    return workingTree;
  }
*/
};
