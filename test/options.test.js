const Autoloader = require("../src");

describe("Option validation", () => {
  test("Fails to instantiate without a valid cwd", () => {
    expect(() => new Autoloader()).toThrowError(
      "You must provide a valid working directory"
    );
  });

  test("Fails to start without valid namespaces", () => {
    const makeLoader = () =>
      new Autoloader({
        cwd: __dirname,
        namespace: {
          xFiles: [123]
        }
      });

    expect(makeLoader).toThrowError(
      "Namespaces must be either a glob or an Array of globs"
    );
  });

  test("Fails to start with invalid ignore[]", () => {
    const makeLoader = () =>
      new Autoloader({
        cwd: __dirname,
        namespace: {
          xFiles: ["./*a.js"]
        },
        ignore: [123]
      });

    expect(makeLoader).toThrowError("ignore option must be an Array of globs");
  });
});
