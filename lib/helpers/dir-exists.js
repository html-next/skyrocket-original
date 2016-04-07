/* jshint node: true */
/* global require, module */
var exists = require('./exists');

module.exports = function dirExists(path, verbose) {
  return exists(path, 'dir', verbose);
};
