/* jshint node: true */
'use strict';
var Promise = require('rsvp').Promise; // jshint ignore:line
var rollup = require('rollup');
var includePaths = require('rollup-plugin-includepaths');
var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');
var TreeSync = require('tree-sync');
var quickTemp = require('quick-temp');

// Create a subclass from Plugin
WorkerCompiler.prototype = Object.create(Plugin.prototype);
WorkerCompiler.prototype.constructor = WorkerCompiler;

const DEFAULT_PLUGIN_OPTIONS = {
  name: 'Worker Compiler',
  annotation: 'Worker Compiler'
};

function WorkerCompiler(inputNode, options) {
  if (inputNode instanceof Array) {
    throw new Error('You must merge trees before calling into the WorkerCompiler');
  }

  options = options || {};
  this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);
  this.workerTmpDir = quickTemp.makeOrRemake(this, 'tmpWorkerDir');
  this.workerTmpTree = null;

  Plugin.call(this, [inputNode], options);
}

WorkerCompiler.prototype.build = function() {
  const options = this.options;

  if (this.inputPaths.length > 1) {
    throw new Error('Too many input paths');
  }

  if (!options || !options.workerSchemas) {
    throw new Error('No worker schemas were provided for compilation.');
  }

  if (this.workerTmpTree === null) {
    this.workerTmpTree = new TreeSync(this.inputPaths[0], this.workerTmpDir);
  }

  const _self = this;
  const workerManifest = makeManifest(options.workerSchemas);

  this.workerTmpTree.sync();
  fs.writeFileSync(path.join(this.outputPath, 'worker-manifest.js'), workerManifest);
  makeDir(this.outputPath, options.workerDestDir);
  makeDir(this.workerTmpDir, options.workerPrefix);

  return iterateWorkers(this.inputPaths[0], this.workerTmpDir, options.workerPrefix, function(worker) {
    return _self.createWorker(worker);
  });
};

WorkerCompiler.prototype.createWorker = function(worker) {
  const options = this.options;
  const schema = options.workerSchemas[worker.name];

  if (!schema) {
    console.log(worker, options.workerSchemas);
    throw new Error(`No worker schema found for ${worker.name}`);
  }

  const workerFile = path.join(this.outputPath, options.workerDestDir, worker.name + '.js');
  const workerShellName = worker.name + '_shell.js';
  const workerShellFile = path.join(this.workerTmpDir, options.workerPrefix, workerShellName);

  schema.moduleName = worker.name;

  return Promise.resolve(createWorker({
    schema,
    moduleDirectory: worker.base,
    workerName: worker.name,
    appName: options.appName,
    workerShellName,
    workerShellFile,
    workerDefinition: worker.fullPath,
    workerDestDir: path.join(this.outputPath, options.workerDestDir),
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

function iterateWorkers(currentPath, workerTempDir, workerPath, callback) {
  // Read files from this.inputPaths, and write files to this.outputPath.
  var builtAll = [];

  // iterate through the workers in this path
  var workers = fs.readdirSync(path.join(currentPath, workerPath));
  var built = workers.map(function(name) {
    return callback({
      base:  workerTempDir,
      name: path.parse(name).name,
      path:  path.join(workerPath, name),
      fullPath: path.join(workerTempDir, workerPath, name)
    });
  });
  builtAll.push(Promise.all(built));

  return Promise.all(builtAll);
}

module.exports = WorkerCompiler;
