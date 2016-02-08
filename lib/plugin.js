/* jshint node:true */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = plugin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

/**
 * Node.JS modules ignored in the resolveId method by default
 */
var externalModules = ['assert', 'buffer', 'console', 'constants', 'crypto', 'domain', 'events', 'http', 'https', 'os', 'path', 'punycode', 'querystring', 'stream', 'string_decoder', 'timers', 'tty', 'url', 'util', 'vm', 'zlib'];

var defaultExtensions = ['.js', '.json'];

var RollupIncludePaths = (function () {
  /**
   * Options:
   *
   * - paths
   * An array of source paths in your project where the plugin should look for files
   * Example: ['src/lib', 'src/foo']
   *
   * - include
   * A map of module=>path/to/file.js with custom module paths. Used to override
   * the search with a static path (like Browserify does with the "browser" config)
   *
   * - external
   * An array of module names that should be excluded from the bundle
   *
   * - extensions
   * An array of file extensions to look for in the project.
   * Default: ['.js', '.json']
   *
   * @param {Object} options
   */

  function RollupIncludePaths(options) {
    _classCallCheck(this, RollupIncludePaths);

    options = options || {};

    // include paths
    this.projectPaths = options.paths;

    this.cache = {};
    if (options.include) {
      this.copyStaticPathsToCache(options.include);
    }

    // external modules to ignore
    this.externalModules = options.external || externalModules;

    // file extensions
    this.extensions = options.extensions || defaultExtensions;
    var extensionMatchers = this.extensions.map(function (e) {
      return e.replace('.', '\\.');
    }).join('|');

    this.HAS_EXTENSION = RegExp('(' + extensionMatchers + ')$');
  }

  /**
   * Rollup plugin method. Implements the Module resolution for project
   * files
   *
   * @param {string} file         File path to search
   * @param {string} [origin]     Origin of the module request
   */

  _createClass(RollupIncludePaths, [{
    key: 'resolveId',
    value: function resolveId(id, origin) {
      origin = origin || false;
      return this.resolveCachedPath(id) || this.searchModule(id, origin);
    }

    /**
     * Rollup plugin method. Modifies the "external" by adding the Node.JS
     * module names to it.
     *
     * @param {Object} options
     */
  }, {
    key: 'options',
    value: function options(_options) {
      if (this.externalModules.length) {
        _options.external = (_options.external || []).concat(this.externalModules);
      }

      return _options;
    }

    /**
     * Receives an object with { moduleName => fullPath }
     *
     * Used to override resolution process with static values, like the
     * `browser` config in Browserify
     *
     * If the path has no file extension, ".js" is implied
     *
     * @param {Object} paths
     */
  }, {
    key: 'copyStaticPathsToCache',
    value: function copyStaticPathsToCache(staticPaths) {
      var cache = this.cache;

      Object.keys(staticPaths).forEach(function (id) {
        var modulePath = staticPaths[id];
        cache[id] = resolveJsExtension(modulePath);
      });

      /**
       * Add '.js' to the end of file path
       * @param {string} file
       * @return {string}
       */
      function resolveJsExtension(file) {
        if (/\.js$/.test(file) === false) {
          file += '.js';
        }

        return file;
      }
    }

    /**
     * Return a path from cache
     * @param {string} id
     * @return {string|nulld}
     */
  }, {
    key: 'resolveCachedPath',
    value: function resolveCachedPath(id) {
      if (id in this.cache) {
        return this.cache[id];
      }

      return false;
    }

    /**
     * @param {string} file         File path to search
     * @param {string} [origin]     Origin of the module request
     */
  }, {
    key: 'searchModule',
    value: function searchModule(file, origin) {
      var newPath = this.searchRelativePath(file, origin) || this.searchProjectModule(file, origin);

      if (newPath) {
        // add result to cache
        this.cache[file] = newPath;
        return newPath;
      }

      // if no path was found, null must be returned to keep the
      // plugin chain!
      return null;
    }

    /**
     * Sarch for a file in the defined include paths
     *
     * @param {string} file         File path to search
     * @param {string} [origin]     Origin of the module request
     * @return {string|null}
     */
  }, {
    key: 'searchProjectModule',
    value: function searchProjectModule(file) {
      var newPath;
      var includePath = this.projectPaths;

      for (var i = 0, ii = includePath.length; i < ii; i++) {
        newPath = this.resolvePath(_path2['default'].resolve(process.cwd(), includePath[i], file), true);

        if (newPath) return newPath;
      }

      return null;
    }

    /**
     * Sarch for a file relative to who required it
     *
     * @param {string} file         File path to search
     * @param {string} [origin]     Origin of the module request
     */
  }, {
    key: 'searchRelativePath',
    value: function searchRelativePath(file, origin) {
      if (!origin) {
        return null;
      }

      var basePath = _path2['default'].dirname(origin);

      return(
        // common case
        // require('./file.js') in 'path/origin.js'
        // > path/file.js
        this.resolvePath(_path2['default'].join(basePath, file), true) ||

          // nodejs path case
          // require('./subfolder') in 'lib/origin.js'
          // > lib/subfolder/index.js
        this.resolvePath(_path2['default'].join(basePath, file, 'index.js'), false)
      );
    }

    /**
     * Resolve a given file path by checking if it exists and
     * optionally also checking if it exists if an extension is
     * appended to file name.
     *
     * If checkExtensions is true, checks for 'file', then 'file.js', 'file.json'
     * and so on, until one is found.
     *
     * Returns false if "file" was not found
     *
     * @param {string} file
     * @param {boolean} [checkExtensions=false]
     * @return {boolean}
     */
  }, {
    key: 'resolvePath',
    value: function resolvePath(file, checkExtensions) {
      if (this.fileExists(file)) {
        return file;
      }

      if (checkExtensions) {
        for (var i = 0, ii = this.extensions.length; i < ii; i++) {
          var ext = this.extensions[i];
          var newPath = file + ext;

          if (this.fileExists(newPath)) {
            return newPath;
          }
        }
      }

      return false;
    }

    /**
     * Check if "file" has one of the extensions defined in the plugin options
     * @param {string} file
     * @return {boolean}
     */
  }, {
    key: 'hasExtension',
    value: function hasExtension(file) {
      return this.HAS_EXTENSION.test(file);
    }

    /**
     * @param {string} file
     * @return {boolean}
     */
  }, {
    key: 'fileExists',
    value: function fileExists(file) {
      console.log('Checking If File Exists: ' + file);
      try {
        var stat = _fs2['default'].statSync(file);
        return stat.isFile();
      } catch (e) {
        return false;
      }
    }
  }]);

  return RollupIncludePaths;
})();

function plugin(options) {
  var resolver = new RollupIncludePaths(options);

  return {
    resolveId: function resolveId(file, origin) {
      console.log('Looking up include path: ', file, origin);
      var resolved = resolver.resolveId(file, origin);
      console.log('Resolution: ', resolved);
      return resolved;
    },

    options: function options(_options2) {
      return resolver.options(_options2);
    }
  };
}

module.exports = exports['default'];
