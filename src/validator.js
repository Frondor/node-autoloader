const fs = require("fs");

const validateCwd = function(cwd) {
  if (!cwd || !fs.statSync(cwd).isDirectory())
    throw new Error("You must provide a valid working directory");
};

const validateNamespace = function(ns) {
  if (
    ns &&
    Object.values(ns).some(glob =>
      Array.isArray(glob)
        ? glob.some(g => typeof g !== "string")
        : typeof glob !== "string"
    )
  )
    throw new TypeError(
      "Namespaces must be either a glob or an Array of globs"
    );
};

const validateIgnore = function(ignore) {
  if (
    ignore &&
    (!Array.isArray(ignore) || ignore.some(glob => typeof glob !== "string"))
  )
    throw new TypeError("ignore option must be an Array of globs");
};

module.exports = {
  cwd: validateCwd,
  ignore: validateIgnore,
  ns: validateNamespace
};
