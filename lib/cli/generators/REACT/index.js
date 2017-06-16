const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const latestVersion = require('latest-version');

const componentsPath = path.resolve(
  __dirname,
  '../..',
  'node_modules',
  '@storybook/components',
  'dist/template'
);

module.exports = latestVersion('@storybook/react').then(version => {
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');
  mergeDirs(componentsPath, '.', 'overwrite');

  const packageJson = helpers.getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/react'] = `^${version}`;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  helpers.writePackageJson(packageJson);
});
