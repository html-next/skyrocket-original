/* jshint node: true */
'use strict';
var EOL = require('os').EOL;
var fs = require('fs');
var path = require('path');
var Promise = require('rsvp').Promise; // jshint ignore:line
var Plugin = require('broccoli-plugin');
var iterateWorkers = require('./iterate-workers');

// Create a subclass from Plugin
WorkerGenerator.prototype = Object.create(Plugin.prototype);
WorkerGenerator.prototype.constructor = WorkerGenerator;

function WorkerGenerator(inputNodes, options) {
  options = options || {
      annotation: 'Worker Generator'
    };
  this.options = options;

  Plugin.call(this, [inputNodes], {
    annotation: options.annotation
  });
}

WorkerGenerator.prototype.assembleWorker = function(worker) {
  var outputFile = path.join(worker.outputPath, this.options.destDir, worker.name + '.js');
  var _options = this.options;

  makeDir(worker.outputPath, this.options.destDir);

  return Promise.resolve(createWorker({
    pathToEmber: _options.ember,
    workerName: worker.name,
    appName: _options.appName,
    includes: [
      { type: 'file', data: _options.ember },
      { type: 'file', data: worker.fullPath }
    ],
    workerFile: outputFile
  }));

};

WorkerGenerator.prototype.build = function() {
  var _self = this;
  return iterateWorkers(this.inputPaths, this.options.workerPrefix, function(worker) {
    worker.outputPath = _self.outputPath;
    return _self.assembleWorker(worker);
  });
};

function makeDir(base, destPath) {
  destPath = destPath.split('/');
  destPath.forEach(function(segment) {
    if (segment) {
      base = path.join(base, segment);
      fs.mkdirSync(base);
    }
  });
}


function createWorker(options) {
  var workerModule = path.join('workers', options.workerName);

  var workerJs = [
    EOL, EOL,
    'require("', workerModule, '")',
    '["default"].create({});', EOL, EOL
  ].join('');

  var concat = options.includes || [];
  concat.push({ type: 'string', data: workerJs });

  concat.forEach(function(item) {
    var data = item.data;
    if (item.type === 'file') {
      data = fs.readFileSync(data);
    }
    fs.appendFileSync(options.workerFile, data);
  });

}

module.exports = WorkerGenerator;
