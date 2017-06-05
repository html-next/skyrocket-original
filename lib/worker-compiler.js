/* jshint node: true */
'use strict';
var Promise = require('rsvp').Promise; // jshint ignore:line
var rollup = require('rollup');
var includePaths = require('rollup-plugin-includepaths');
var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');

// Create a subclass from Plugin
WorkerCompiler.prototype = Object.create(Plugin.prototype);
WorkerCompiler.prototype.constructor = WorkerCompiler;

const DEFAULT_PLUGIN_OPTIONS = {
  name: 'Worker Compiler',
  annotation: 'Worker Compiler'
};

function WorkerCompiler(inputNodes, options) {
  options = options || {};
  this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);

  if (!(inputNodes instanceof Array)) {
    inputNodes = [inputNodes];
  }

  Plugin.call(this, inputNodes, options);
}

WorkerCompiler.prototype.build = function() {
  const _self = this;
  const workerManifest = makeManifest(this.options.workerSchemas);

  fs.writeFileSync(path.join(this.outputPath, 'worker-manifest.js'), workerManifest);
  makeDir(this.outputPath, this.options.workerDestDir);

  return iterateWorkers(this.inputPaths, this.options.workerPrefix, function(worker) {
    return _self.createWorker(worker);
  });
};

WorkerCompiler.prototype.createWorker = function(worker) {
  const OPTS = this.options;
  const schema = OPTS.workerSchemas[worker.name];
  const workerFile = path.join(this.outputPath, OPTS.workerDestDir, worker.name + '.js');
  const workerShellName = worker.name + '-worker.js';
  const workerShellFile = path.join(worker.base, OPTS.workerPrefix, worker.name + '-worker.js');

  schema.moduleName = worker.name;

  return Promise.resolve(createWorker({
    schema,
    moduleDirectory: worker.base,
    workerName: worker.name,
    appName: OPTS.appName,
    workerShellName,
    workerShellFile,
    workerDefinition: worker.fullPath,
    workerDestDir: path.join(this.outputPath, OPTS.workerDestDir),
    workerFile,
  }));
};

function makeManifest(workerSchemas) {
  return `export default ${JSON.stringify(workerSchemas)};`;
}

function makeWorker(schema) {
  return `
  import WorkerShell from 'skyrocket/worker-shell';
  import WorkerKlass from './${schema.moduleName}';

  const WorkerSchema = ${JSON.stringify(schema)};

  new WorkerShell(${schema.className}, WorkerSchema);
`;
}

function createWorker(options) {
  try {
    fs.mkdirSync(options.workerDestDir);
  } catch (e) {
    if ( e.code != 'EEXIST' ) throw e;
  }

  fs.writeFileSync(options.workerShellFile, makeWorker(options.schema));

  return rollup.rollup({
    entry: options.workerShellFile,
    plugins: [ makePlugin(options.moduleDirectory) ]
  }).then(function(bundle) {
    return bundle.write({
      dest: options.workerFile,
      format: 'iife',
    });
  }).then(function() {});
}

function makePlugin(basePath) {
  var includePathOptions = {
    include: [],
    paths: [basePath, path.join(basePath, 'modules')],
    external: [],
    extensions: ['.js', '.json', '\/index.js']
  };

  return includePaths(includePathOptions);
}

function makeDir(base, destPath) {
  destPath = destPath.split('/');
  destPath.forEach(function(segment) {
    if (segment) {
      base = path.join(base, segment);
      try {
        fs.mkdirSync(base);
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
      }
    }
  });
}

function iterateWorkers(inputPaths, workerPath, callback) {
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
}

module.exports = WorkerCompiler;
