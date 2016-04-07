/* jshint node: true */
/* global module, require */
'use strict';

var fs = require('fs');
var EOL = require("os").EOL;

function build(file, inputs) {
  inputs.forEach(function (input) {
    fs.appendFileSync(file, input + EOL);
  });
  return true;
}

module.exports = function createWorkerBoot(path) {
  var lines = [
    "var WorkerInstance = require('" + path + "')['default'].create({});"
  ];
  return build(path, lines);
};
