const path = require('path');

module.exports = [
  {
    name: '@storybook/preset-scss',
  },
  {
    name: '@storybook/preset-typescript',
    options: {
      // point the loader here to override the root "noEmit" compilerOption
      tsLoaderOptions: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
      // we must use our config to ensure props and their comments are loaded
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
        // https://github.com/styleguidist/react-docgen-typescript#parseroptions
        propFilter: prop => {
          if (prop.parent) {
            return !prop.parent.fileName.includes('node_modules/@types/react/');
          }

          return true;
        },
      },
    },
  },
  {
    name: '@storybook/addon-docs/react/preset',
  },
];
