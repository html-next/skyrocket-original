/* jshint node: true */
'use strict';
var path = require('path');
var fs = require('fs');
var Promise = require('rsvp').Promise; // jshint ignore:line
var debug = require('debug')('skyrocket');
var chalk = require('chalk');

/*
  Walks a set of `inputPaths` looking for instances of `workerPath`,
  executes `callback` for each worker found within each `workerPath`
 */
module.exports = function iterateWorkers(inputPaths, workerPath, callback) {
  // Read files from this.inputPaths, and write files to this.outputPath.

  // collects promises
  var builtAll = [];

  inputPaths.forEach(function(currentPath) {
    // iterate through the workers in this path
    var workers = fs.readdirSync(path.join(currentPath, workerPath));

    // map the discovered workers
    var built = workers.map(function(name) {
      var worker = {
        base: currentPath,
        name: path.parse(name).name,
        path:  path.join(workerPath, name),
        fullPath: path.join(currentPath, workerPath, name)
      };

      debug(chalk.green('\tDiscovered: ') + chalk.white(worker.name + chalk.grey(' at ') + worker.path));

      return callback(worker);
    });

    // return a promise to keep broccoli happy
    builtAll.push(Promise.all(built));
  });

  // return a promise to keep broccoli happy
  return Promise.all(builtAll);
};
