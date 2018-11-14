const fg = require("fast-glob"); // TBR by tiny-glob after v1
const path = require("path");
const validate = require("./validator");

/**
 * This error-first callback fires after all the globs have been resolved
 * @callback readyFn
 * @param {Error} error if any error happened, it'll be assigned to this param
 * @param {Namespace} namespace The resolved namespaces with getters for lazy-loading modules
 */

/**
 * @typedef {Object} AutoloaderOptions
 * @prop {path} cwd The root directory to start autoloading from
 * @prop {Object} namespace Key-value store of namespaces and their respective glob strings
 * @prop {Boolean} [onlyFiles=true] Return only files.
 * @prop {string|string[]} [ignore=[]] String or Array of globs to prevent matching files from being actually matched.
 */

/**
 * @type {AutoloaderOptions}
 */
const defaultOptions = {
  cwd: null,
  namespace: {},
  onlyFiles: true,
  ignore: []
};

module.exports = class Autoloader {
  constructor(opts = defaultOptions) {
    const { cwd, namespace } = (this.fgOptions = Autoloader.validate(opts));
    this.cwd = cwd;
    this.namespace = namespace || {};
  }

  static validate(opts) {
    validate.cwd(opts.cwd);
    validate.ns(opts.namespace);
    validate.ignore(opts.ignore);

    return opts;
  }

  buildNS(ns) {
    return Object.keys(ns).reduce((space, name) => {
      const matches = Array.isArray(ns[name]) ? ns[name] : [ns[name]];

      space[name] = fg
        .sync(matches, this.fgOptions)
        .reduce((entries, entry) => {
          Object.defineProperty(entries, entry.replace(/\.js$/, ""), {
            configurable: true,
            enumerable: true,
            get: () => require(path.join(this.cwd, entry))
          });

          return entries;
        }, {});

      return space;
    }, {});
  }

  emitReady(readyFn, err) {
    readyFn && readyFn.apply(this, [err, this.namespace]);
  }

  /**
   * Resolve the globs and load the files as getters for lazy-loading modules
   * @param {readyFn} readyFn
   */
  load(readyFn) {
    try {
      this.namespace = this.buildNS(this.namespace);
    } catch (err) {
      return this.emitReady(readyFn, err);
    }

    this.emitReady(readyFn);
  }
};
