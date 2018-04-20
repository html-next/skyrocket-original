/* jshint node: true */
'use strict';
var rollup = require('rollup');
var Plugin = require('broccoli-plugin');
var fs = require('fs');
const broccoli = require('broccoli');
const MergeTrees = require('merge-trees');
const RSVP = require('rsvp');

// Create a subclass from Plugin
TreeSplit.prototype = Object.create(Plugin.prototype);
TreeSplit.prototype.constructor = TreeSplit;

const DEFAULT_PLUGIN_OPTIONS = {
  name: 'TreeSplit',
  annotation: 'TreeSplit'
};

function TreeSplit(inputNode, options) {
  if (inputNode instanceof Array) {
    throw new Error('You must merge trees before calling into the WorkerCompiler');
  }

  options = options || {};
  this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);

  if (typeof options.split !== 'function') {
    throw new Error('Must supply a split function to TreeSplit');
  }
  if (typeof options.reduce !== 'function') {
    throw new Error('Must supply a reduce function to TreeSplit');
  }

  this.mergeTree = null;
  this.builders = null;
  this.builderPaths = null;
  this.builderCache = {};

  Plugin.call(this, [inputNode], options);
}

TreeSplit.prototype.build = function() {
  const options = this.options;

  if (this.inputPaths.length > 1) {
    throw new Error('Too many input paths');
  }

  let merger = this.mergeTree;
  let builders = this.builders;
  let builderPaths = this.builderPaths;

  if (merger === null) {
    builders = this.builders = [];
    builderPaths = this.builderPaths = [];
    merger = this.mergeTree = new MergeTrees(builderPaths, this.outputPath, { overwrite: true });
  } else {
    builderPaths.length = 0;
    builders.length = 0;
  }

  const inputPath = this.inputPaths[0];
  const cachedBuilderNames = Object.keys(this.builderCache);
  const splits = options.split(inputPath);

  splits.forEach(([key, localOptions]) => {
    let index = cachedBuilderNames.indexOf(key);

    if (index !== -1) {
      cachedBuilderNames.splice(index, 1);
      builders.push(this.builderCache[key]);
    } else {
      let builder = this.builderCache[key] = new broccoli.Builder(options.reduce(inputPath, localOptions));
      builders.push(builder);
    }
  });

  cachedBuilderNames.forEach((key) => {
    delete this.builderCache[key];
  });

  return buildAll(builders)
    .then((paths) => {
      builderPaths.push(...paths);
      return merger.merge();
    });
};

function buildAll(builders) {
  const builderPromises = builders.map((builder) => {
    return builder.build();
  });

  return RSVP.Promise.all(builderPromises)
    .then(() => {
      return builders.map((builder) => {
        return builder.outputPath;
      });
    });
}

module.exports = TreeSplit;
