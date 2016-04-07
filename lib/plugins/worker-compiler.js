/* jshint node: true */
'use strict';
var rollup = require('rollup');
var includePaths = require('rollup-plugin-includepaths');
var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');
var iterateWorkers = require('../helpers/iterate-workers');
var debug = require('debug')('skyrocket');
var chalk = require('chalk');

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
  debug(chalk.cyan('\t\tCompiling Worker: ') + chalk.yellow(worker.name));
  console.log(worker);
  var outputFile = path.join(worker.outputPath, 'workers', worker.name + '.js');
  debug(chalk.grey('\t–> ') + chalk.white(outputFile));

  fs.mkdirSync(worker.outputPath + '/workers');

  return rollup.rollup({
    entry: worker.fullPath,
    plugins: [
      makePlugin(worker.base)
    ]
  }).then(function(bundle) {
    return bundle.write({
      // format: 'cjs',
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
