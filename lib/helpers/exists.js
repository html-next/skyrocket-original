/* jshint node: true */
/* global require, module */
var fs = require('fs');
var chalk = require('chalk');
var debug = require('debug')('skyrocket');

module.exports = function exists(pathToCheck, type, verbose) {
  var stats;
  try {
    stats = fs.statSync(pathToCheck);
  } catch (e) {
    stats = false;
  }

  var typeCheck = type === 'file' ? 'isFile' : 'isDir';

  if (stats && stats[typeCheck]()) {
    if (verbose) {
      debug(
        chalk.green('[✓] ' + type) + chalk.grey(' ' + pathToCheck)
      );
    }
    return pathToCheck;
  }

  if (verbose) {
    debug(
      chalk.red('[x] ' + type) + chalk.grey(' ' + pathToCheck)
    );
  }
  return false;
};
