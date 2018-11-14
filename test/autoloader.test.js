const Autoloader = require("../src");
const { mockFS, clearNamespace } = require("./utils");

describe("Autoloader class", () => {
  test("Successfully instantiates", () => {
    expect(new Autoloader({ cwd: __dirname })).toMatchObject({
      namespace: {}
    });
  });

  test("Load namespace by string", () => {
    const mockedNamespace = mockFS(__dirname, {
      xFiles: {
        "level1/file.x": 123,
        "level1/level2/file.x": 555
      }
    });

    const loader = new Autoloader({
      cwd: mockedNamespace.cwd,
      namespace: {
        xFiles: "./**/*.x.js"
      }
    });

    loader.load((err, namespace) => {
      expect(namespace).toEqual(mockedNamespace);
    });
  });

  test("Load namespace by array", () => {
    const mockedNamespace = mockFS(__dirname, {
      xFiles: {
        "level1/file.x": 123,
        "level1/level2/file.x": 456,
        "level1/domatch": 789
      }
    });

    const loader = new Autoloader({
      cwd: mockedNamespace.cwd,
      namespace: {
        xFiles: ["./**/*.x.js", "./**/*domatch*"]
      }
    });

    loader.load((err, namespace) => {
      expect(namespace).toEqual(mockedNamespace);
    });
  });


  test("Dont match anything", () => {
    const mockedNamespace = mockFS(__dirname, {
      xFiles: {
        "level1/file.x": 123,
        "level1/level2/file.x": 456,
        "level1/domatch": 789
      }
    });

    const loader = new Autoloader({
      cwd: mockedNamespace.cwd,
      namespace: {
        xFiles: ["./**/*.jpg"]
      }
    });

    loader.load((err, namespace) => {
      expect(namespace.xFiles).toEqual({});
    });
  });

  test("Weak-test matching capabilities", () => {
    const wontMatch = "level1/nomatch";
    const mockedNamespace = mockFS(__dirname, {
      xFiles: {
        "level1/file.x": 123,
        "level1/level2/file.x": 456,
        [wontMatch]: 789,
        "level1/domatch": 666
      }
    });

    const loader = new Autoloader({
      cwd: mockedNamespace.cwd,
      namespace: {
        xFiles: ["./**/*.x.js", "./**/domatch*"]
      }
    });

    loader.load((err, namespace) => {
      delete mockedNamespace.xFiles[wontMatch];
      expect(namespace).toEqual(mockedNamespace);
    });
  });

  test("Passing a non-function transform property throws", () => {
    const mockedNamespace = mockFS(__dirname, {
      xFiles: { "level1/file.x": 123 }
    });

    const loader = new Autoloader({
      cwd: mockedNamespace.cwd,
      namespace: {
        xFiles: ["./**/*.x.js"]
      },
      transform: "shit"
    });

    loader.load(err =>
      expect(err.message).toBe("this.options.transform is not a function")
    );
  });
});

afterAll(() => clearNamespace(__dirname));
