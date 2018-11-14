# Autoload <small>_[Proof of concept]_</small>

<p align="center">
  <!-- <a href="https://www.npmjs.com/package/autoload">
    <img src="https://img.shields.io/npm/v/autoload.svg" alt="npm version">
  </a> -->
  <a href="https://travis-ci.org/Frondor/node-autoloader">
    <img src="https://img.shields.io/travis/Frondor/node-autoloader/master.svg" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/Frondor/node-autoloader">
    <img src="https://img.shields.io/codecov/c/github/frondor/node-autoloader/master.svg" alt="coverage">
  </a>
  <!-- <a href="https://bundlephobia.com/result?p=autoload@latest">
    <img src="https://img.shields.io/bundlephobia/minzip/autoload.svg" alt="Package size">
  </a> -->
  <!-- <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/Frondor/autoload.svg" alt="Greenkeeper badge">
  </a> -->
  <!-- <a href="https://snyk.io/test/npm/autoload">
    <img src="https://snyk.io/test/npm/autoload/badge.svg" alt="Known Vulnerabilities">
  </a> -->
</p>

Automatically create a namespace of lazy-imported modules from the filesystem, by using glob patterns.

## Table of contents

1. [Installation](#installation)
2. [Getting started](#getting-started)
3. [API](#api)
4. [Options](#options)

## Installation

Run

```console
> npm i git+https://git@github.com/frondor/autoloader.git
```

## Getting started

Import this package and create an instance by passing an [Options](#options) object, then call the `load()` method on it.

```js
// /src/config/app.js
module.exports = { version: "1.0" };

// /src/index.js
import Autoloader from "autoloader";

const loader = new Autoloader({
  cwd: __directory,
  namespace: {
    controllers: "./**/*Controller.js",
    config: ["./config/*.js", "./*.config.js"]
  },
  ignore: ["./controllers/BaseController.js"]
});

loader.load((err, namespace) => {
  if (err) throw err;

  // Since modules are assigned as getters on each namespace
  // the require() function shall only resolve, once the getter
  // has been accessed.
  // So require("./config/app.js") won't be fired until the below
  // statement runs, and then it will always hit require.cache on
  // subsequent calls.
  const version = namespace.config["config/app"].version;
  console.log(version === "1.0");
});
```

## API

### `loader.load(readyFn: function)`

Resolves all the globs passed to the `namespace` option and fires the given `readyFn` callback.

### `readyFn(err, namespace)`

An error-first callback to be fired after the `load` method resolved all the globs.

- `err`: an error is assigned to this argument if something bad happened
- `namespace`: an object containing a dictionary of namespaces, whose values are another dictionary of `file paths` (key) and `file contents` (value), as `key: value` respectively.

Example:

```js
const loader = new Autoloader({
  namespace: {
    config: "./config/*.js"
  }
});

loader.load((err, namespace) => {
  if (err) throw err;
  // namespace =
  // {
  //   config: {
  //     "config/app" = { version: "1.0" }
  //   }
  // }

  const version = namespace.config["config/app"].version;
  console.log(version === "1.0");
});
```

### `Options`

`new Autoload(AutoloadOptions)`

#### `cwd` (path string)

The root directory to start autoloading from.

> This option is mandatory

#### `namespace` ({})

Key-value store of namespaces and their respective glob strings

#### `ignore` (string|string[])

String or Array of globs to prevent matching files from being actually matched.

#### `onlyFiles: true` (Boolean)

Return only files
