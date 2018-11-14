const path = require("path");
const fs = require("fs-extra");

/**
 * Mock the filesystem, creating files with given content
 * @param {*} cwd Root directory for test files where the FS is being mocked
 * @param {*} ns The namespace object that should return from the glob search
 * @returns ns
 */
const mockFS = (cwd, ns) => {
  mockFS.count = mockFS.count ? mockFS.count + 1 : 1;
  Object.keys(ns).forEach(namespance =>
    Object.keys(ns[namespance]).map(fileName => {
      fs.outputFileSync(
        path.join(cwd, "namespace", "test#" + mockFS.count, fileName + ".js"),
        "module.exports = " + ns[namespance][fileName]
      );
    })
  );

  ns.__proto__.cwd = path.join(cwd, "namespace", "test#" + mockFS.count);
  return ns;
};

const clearNamespace = dir => fs.removeSync(path.join(dir, "namespace"));

module.exports = {
  mockFS,
  clearNamespace
};
