/* jshint node: true */
'use strict';
var Promise = require('rsvp').Promise; // jshint ignore:line
var rollup = require('rollup');
var includePaths = require('rollup-plugin-includepaths');
var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');

// Create a subclass from Plugin
BroccoliResolve.prototype = Object.create(Plugin.prototype);
BroccoliResolve.prototype.constructor = BroccoliResolve;

const DEFAULT_PLUGIN_OPTIONS = {
  name: 'Broccoli Resolve',
  annotation: 'Broccoli Resolve'
};

function BroccoliResolve(inputNodes, options) {
  options = options || {};
  this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);

  Plugin.call(this, [inputNodes], options);
}

BroccoliResolve.prototype.build = function() {
  const _self = this;
  const seen = Object.create(null);

  return iterateEntries(this.inputPaths, this.options.entriesPath, function(entry) {
    return _self.collectEntry(entry, seen);
  });
};

BroccoliResolve.prototype.collectEntry = function(worker, seen) {
  console.log('resolve mudle', worker);
  const OPTS = this.options;
  const schema = OPTS.workerSchemas[worker.path];
  const workerFile = path.join(this.outputPath, OPTS.workerDestDir, worker.name + '.js');
  const workerInterfaceFile = path.join(this.outputPath, OPTS.workerPrefix, worker.name + '.js');

  console.log({ schema, workerFile, workerInterfaceFile });

  return Promise.resolve(createWorker({
    schema,
    workerName: worker.name,
    appName: OPTS.appName,
    workerDefinition: worker.fullPath,
    workerFile,
    workerInterfaceFile
  }));
};

function makeDir(base, destPath) {
  destPath = destPath.split('/');
  destPath.forEach(function(segment) {
    if (segment) {
      base = path.join(base, segment);
      try {
        fs.mkdirSync(base);
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
      }
    }
  });
}

function iterateEntries(inputPaths, entriesPath, callback) {
  // Read files from this.inputPaths, and write files to this.outputPath.
  var builtAll = [];

  inputPaths.forEach(function(currentPath) {
    // iterate through the workers in this path
    var entries = fs.readdirSync(path.join(currentPath, entriesPath));
    var built = entries.map(function(name) {
      return callback({
        base: currentPath,
        name: path.parse(name).name,
        path:  path.join(entriesPath, name),
        fullPath: path.join(currentPath, entriesPath, name)
      });
    });
    builtAll.push(Promise.all(built));
  });

  return Promise.all(builtAll);
}

module.exports = WorkerCompiler;
