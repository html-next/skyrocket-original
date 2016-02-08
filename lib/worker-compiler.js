/* jshint node: true */
'use strict';
var rollup = require('rollup');
var includePaths = require('rollup-plugin-includepaths'); // require('./plugin'); //
var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');
var iterateWorkers = require('./iterate-workers');

// Create a subclass from Plugin
WorkerCompiler.prototype = Object.create(Plugin.prototype);
WorkerCompiler.prototype.constructor = WorkerCompiler;

function WorkerCompiler(inputNodes, options) {
  options = options || {
      annotation: 'Worker Compiler'
    };
  this.options = options;

  Plugin.call(this, [inputNodes], {
    annotation: options.annotation
  });
}

WorkerCompiler.prototype.buildWorker = function(worker) {
  console.log('Compiling Worker', worker.name);
  console.log(worker);
  var outputFile = path.join(worker.outputPath, 'workers', worker.name + '.js');
  console.log('Destination file: ' + outputFile);

  fs.mkdirSync(worker.outputPath + '/workers');

  return rollup.rollup({
    entry: worker.fullPath,
    plugins: [
      makePlugin(worker.base)
    ]
  }).then(function(bundle) {
    return bundle.write({
      dest: outputFile
    });
  });

};

WorkerCompiler.prototype.build = function() {
  var _self = this;
  return iterateWorkers(this.inputPaths, 'workers', function(worker) {
    worker.outputPath = _self.outputPath;
    worker.fullPath += '/worker.js';
    return _self.buildWorker(worker);
  });
};


function makePlugin(path) {
  var includePathOptions = {
    include: [],
    paths: [path],
    external: [],
    extensions: ['.js', '.json', '\/index.js']
  };

  return includePaths(includePathOptions);
}

module.exports = WorkerCompiler;
