const path = require('path');
const { fileURLToPath } = require('url');
const { globSync } = require('glob');
const fs = require('fs');
const YAML = require('yaml');

/* Use the process current working directory to avoid any path related errors */
const dirname = process.cwd();

class AddBundlesToLibrariesPlugin {
  constructor(options) {
    this.options = {
      distPath: null,
      libraryFileName: null,
      moduleName: null
    };

    this.validateOptions(this.options);

    this.options.distPath = options?.distPath ?? path.resolve(dirname, 'dist');
    this.options.libraryFileName = options?.libraryFileName ?? (() => {
      const libraryName = path.resolve(dirname, '..').split('/').slice(-1);
      return path.resolve(dirname, (`../${libraryName + '.libraries.yml'}`));
    })();

    this.options.moduleName = options?.moduleName ?? (() => {
      return path.resolve(dirname, '..').split('/').slice(-1);
    })();
  }

  /**
   * Validates the options to the plugin.
   *
   * This function checks that the options object contains valid values for
   * optional parameters.
   * If supplied, these options must be a non-empty string.
   *
   * @param {Object} options - The options object to validate.
   * @param {string} options.distPath - The path to the distribution directory.
   *  Must be a non-empty string.
   * @param {string} options.libraryFileName - The name of the library file.
   *  Must be a non-empty string.
   * @param {string} options.moduleName - The name of the module.
   *  Must be a non-empty string.
   * @throws {Error} Will throw an error if any of the options are invalid.
   */
  validateOptions(options) {
    // Check that distPath is a string and not null or empty
    if (options.distPath && typeof options.distPath === 'string') {
      throw new Error('Invalid distPath: must be a non-empty string.');
    }

    // Check that libraryFileName is a string and not null or empty
    if (options.libraryFileName &&
        typeof options.libraryFileName === 'string') {
      throw new Error('Invalid libraryFileName: must be a non-empty string.');
    }

    // Check that moduleName is a string and not null or empty
    if (options.moduleName && typeof options.moduleName === 'string') {
      throw new Error('Invalid moduleName: must be a non-empty string.');
    }
  }

  apply(compiler) {
    compiler.hooks.done.tap('Add output bundles to module library', () => {
      const distPath = '../' + this.options.distPath;
      const libraryFileName = this.options.libraryFileName;

      let bundleFiles = globSync(`${distPath}/*.js`).map(file => path.basename(file));
      let cssFiles = globSync(`${distPath}/*.css`).map(file => path.basename(file));

      try {
        const fileContents = fs.readFileSync(libraryFileName, 'utf-8');
        const data = YAML.parse(fileContents);
        const moduleKey = Object.keys(data);

        data[moduleKey] = {};

        if (bundleFiles.length > 0) {
            data[moduleKey].js = {};
            bundleFiles.forEach(file => {
              const bundlePath = `${this.options.distPath}/${file.split(this.options.moduleName)[0]}`;
              data[moduleKey].js[bundlePath] = {minified: true, preprocess: false};
            });
        }

        if (cssFiles.length > 0) {
            data[moduleKey].css = {};
            cssFiles.forEach(file => {
              const bundlePath = `${this.options.distPath}/${file.split(this.options.moduleName)[0]}`;
              data[moduleKey].css.layout[bundlePath] = {};
            });
        }

        fs.writeFileSync(libraryFileName, YAML.stringify(data));
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = AddBundlesToLibrariesPlugin;
