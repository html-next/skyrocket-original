/* jshint node: true */
'use strict';
const StripClassCallCheck = require('babel6-plugin-strip-class-callcheck');
const FilterImports = require('babel-plugin-filter-imports');
const RemoveImports = require('babel6-plugin-remove-imports');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const debug = require('broccoli-stew').debug;
const ExtractWorkerSchemas = require('./lib/babel-plugin-generate-decorator-schema');
const WorkerCompiler = require('./lib/worker-compiler');

function isProductionEnv() {
  var isProd = /production/.test(process.env.EMBER_ENV);
  var isTest = process.env.EMBER_CLI_TEST_COMMAND;

  return isProd && !isTest;
}

module.exports = {
  name: 'skyrocket',

  isDevelopingAddon: function() {
    return true;
  },

  /*
    `true` once we have configured babel the first time.

    @property {Boolean} _hasSetupBabelOptions
    @private
   */
  _hasSetupBabelOptions: false,

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    this.options = this.options || {};
  },

  buildBabelOptions() {
    const workerPrefix = 'workers/';
    const workerSchemas = this.workerSchemas = {};

    process.__skyrocketWorkerSchemas = workerSchemas;

    const opts = {
      loose: true,
      plugins: [],
      postTransformPlugins: [StripClassCallCheck],
      exclude: [
        'transform-es2015-block-scoping',
        'transform-es2015-typeof-symbol',
      ]
    };

    if (isProductionEnv()) {
      const strippedImports = {
        'skyrocket/-debug': [
          'assert',
          'warn',
          'debug',
          'debugOnError',
          'deprecate',
          'stripInProduction'
        ]
      };

      opts.plugins.push(
        [FilterImports, strippedImports],
        [RemoveImports, 'skyrocket/-debug']
      );
    }

    opts.plugins.push(
      ['syntax-decorators'],
      [ExtractWorkerSchemas, { workerPrefix }],
      ['transform-decorators-legacy'],
      ['transform-decorators'],
      ['transform-es2015-block-scoping', { 'throwIfClosureRequired': true }]
    );

    return opts;
  },
  _setupBabelOptions: function() {
    if (this._hasSetupBabelOptions) {
      return;
    }

    this.options.babel = this.buildBabelOptions();

    this._hasSetupBabelOptions = true;
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    if (typeof app.import !== 'function') {
      throw new Error('@html-next/skyrocket is being used within another addon or engine ' +
        'and is having trouble registering itself to the parent application.');
    }

    this._trueApp = app;
    this._env = app.env;
    this._setupBabelOptions();
  },

  treeForAddon: function(tree) {
    console.log('treeForAddon');
    let privateTree = new Funnel(tree, {
      exclude: [
        isProductionEnv() ? '-debug' : false,
      ].filter(Boolean)
    });

    let mainTree = new Funnel(privateTree, {
      include: [ '-debug/**.js', '-main/**/**.js' ],
      destDir: '.'
    });

    let workerTree = new Funnel(privateTree, {
      include: [ '-debug/**.js', '-workers/**/**.js' ],
      destDir: '.'
    });

    this.addonTreeForWorkers = debug(workerTree, { name: 'addon-tree-for-workers' });

    mainTree = debug(mainTree, { name: 'addon-tree-for-main' });

    return this._super.treeForAddon ?
      this._super.treeForAddon.call(this, mainTree) :
      mainTree;
  },

  createWorkerTree: function() {
    this._setupBabelOptions();
    const babel = this.addons.find(addon => addon.name === 'ember-cli-babel');
    const app = this._trueApp;
    const tree = app.trees.app;
    const workersWithDependenciesTree = this._workerScopeTree(tree);
    const babelOptions = this.options.babel;

    // TODO filter based on rollup resolution first, but without actually rolling-up
    const transpiled = debug(babel.transpileTree(workersWithDependenciesTree, {
      babel: babelOptions,
      'ember-cli-babel': {
        compileModules: false
      }
    }), { name: 'transpiled-worker-tree' });

    const workerSchemas = this.workerSchemas;
    const assembled = new WorkerCompiler(transpiled, {
      appName: app.name,
      workerSchemas: workerSchemas,
      workerPrefix: 'workers/',
      workerDestDir: 'assets/workers/'
    });

    app.trees.app = new Funnel(tree, {
      exclude: ['workers/**.js']
    });

    this.manifestTree = new Funnel(assembled, {
      files: ['worker-manifest.js']
    });

    this.workerTree = new Funnel(assembled, {
      include: ['assets/workers/**.js']
    });
  },

  treeForApp: function(tree) {
    this.createWorkerTree();
    return this._super.treeForApp(mergeTrees([tree, this.manifestTree]));
  },

  treeForPublic: function() {
    return this.workerTree;
  },

  _workerScopeTree(tree) {
    console.log('_workerScopeTree');
    // grab addon modules
    const addonTrees = addonTreesFor(this.project, 'addon');

    console.log('adding addonTreeForWorkers');
    addonTrees.push(this.addonTreeForWorkers);

    const mergedAddons = mergeTrees(addonTrees);
    const funneledAddons = new Funnel(mergedAddons, {
      srcDir: 'modules',
      allowEmpty: true
    });

    // combine with app
    return mergeTrees([funneledAddons, tree]);
  },
};

function addonTreesFor(project, type) {
  return project.addons.map(function(addon) {
    if (addon.treeFor) {
      return addon.treeFor(type);
    }
  }).filter(Boolean);
}
