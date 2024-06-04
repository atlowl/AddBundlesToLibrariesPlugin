# AddBundlesToLibrariesPlugin

`AddBundlesToLibrariesPlugin` is a Webpack plugin that helps you manage JavaScript bundles and add them to your library files. It ensures that your bundles are correctly minified and preprocessed.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the plugin, run:

```bash
npm install add-bundles-to-libraries-plugin
```

## Usage
To use AddBundlesToLibrariesPlugin in your Webpack configuration,
you need to require it and add it to the plugins array in your Webpack configuration file.
```
const AddBundlesToLibrariesPlugin = require('add-bundles-to-libraries-plugin');
```

### Options
AddBundlesToLibrariesPlugin accepts the following options:

 - distPath: The path to the distribution directory. Must be a non-empty string if provided.
 - libraryFileName: The name of the library file. Must be a non-empty string if provided.
 - moduleName: The name of the module. Must be a non-empty string if provided.

## Example
Without options, the module will try and detect your environment
```
module.exports = {
  // Your Webpack configuration
  plugins: [
    new AddBundlesToLibrariesPlugin()
  ]
};
```

Alternatively, you may provide options to the plugin to specify the paths
```
module.exports = {
  // Your Webpack configuration
  plugins: [
    new AddBundlesToLibrariesPlugin({
      distPath: 'path/to/distribution_folder_for_project',
      libraryFileName: 'my_module.libraries.yml',
      moduleName: 'my_module'
    })
  ]
};
```