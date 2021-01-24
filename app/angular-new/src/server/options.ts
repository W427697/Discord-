import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'angular-new',
  frameworkPresets: [require.resolve('./framework-preset-framework.js')],
};
