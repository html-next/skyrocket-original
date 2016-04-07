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

module.exports = function createWorkerShell(path, name) {
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
};
