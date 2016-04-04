/* jshint node: true */
/* global require, module */
var exists = require('./exists');

module.exports = function fileExists(path, verbose) {
  return exists(path, 'file', verbose);
};
