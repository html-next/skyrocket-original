/* jshint node: true */
'use strict';
var path = require('path');
var fs = require('fs');
var Promise = require('rsvp').Promise; // jshint ignore:line

module.exports = function iterateWorkers(inputPaths, workerPath, callback) {
  // Read files from this.inputPaths, and write files to this.outputPath.
  var builtAll = [];

  inputPaths.forEach(function(currentPath) {
    // iterate through the workers in this path
    var workers = fs.readdirSync(path.join(currentPath, workerPath));
    var built = workers.map(function(name) {
      return callback({
        base: currentPath,
        name: path.parse(name).name,
        path:  path.join(workerPath, name),
        fullPath: path.join(currentPath, workerPath, name)
      });
    });
    builtAll.push(Promise.all(built));
  });

  return Promise.all(builtAll);
};
