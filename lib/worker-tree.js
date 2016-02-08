/* jshint node: true */
'use strict';
var WorkerCompiler = require('./worker-compiler');
var WorkerGenerator = require('./worker-generator');
var BabelTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var path = require('path');
// var log = require('broccoli-stew').log;

module.exports = function(app) {
  var tree = app.trees.app;

  // grab addon modules
  var addonTrees = addonTreesFor(this.project, 'addon');
  var mergedAddons = mergeTrees(addonTrees);
  var funneledAddons = new Funnel(mergedAddons, {
    srcDir: 'modules'
  });

  // combine with app
  var combinedTree = mergeTrees([funneledAddons, tree]);

  // find and rollup workers
  var workers = new WorkerCompiler(combinedTree);

  // transpile workers
  var transpiled = new BabelTranspiler(workers, {
    loose: true,
    moduleIds: true,
    modules: 'amdStrict',
    browserPolyfill: true
  });

  // create worker asset files
  var pathToEmber = path.join(app.project.root, app.bowerDirectory, 'ember/ember.min.js');
  var assembled = new WorkerGenerator(transpiled, {
    ember: pathToEmber,
    appName: app.name,
    workerPrefix: 'workers',
    destDir: 'assets/workers'
  });

  return assembled;

};


function addonTreesFor(project, type) {
  return project.addons.map(function(addon) {
    if (addon.treeFor) {
      return addon.treeFor(type);
    }
  }).filter(Boolean);
}
