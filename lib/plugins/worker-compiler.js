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
var EOL = require("os").EOL;

function build(file, inputs) {
  inputs.forEach(function (input) {
    fs.appendFileSync(file, input + EOL);
  });
  return true;
}

function createWorkerShell(path, name) {
  var lines = [
    "import WorkerApp from './worker';",
    "import Contract from './contract';",
    "import WorkerShell from 'skyrocket/-private/-worker-shell';",
    "",
    "export default WorkerShell.extend({",
    "  worker: WorkerApp",
    "  contract: Contract",
    "  name:" + name,
    "});"
  ];
  return build(path, lines);
}

function createWorkerBoot(path) {
  var lines = [
    "var WorkerInstance = require('" + path + "')['default'].create({});"
  ];
  return build(path, lines);
}

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
