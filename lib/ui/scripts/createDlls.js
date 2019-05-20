import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import findCacheDir from 'find-cache-dir';

import config from './webpackDllsConfig';

const resolveLocal = dir => path.join(__dirname, dir);
const webpackAsPromised = c =>
  new Promise((res, rej) => {
    webpack(c).run((err, stats) => {
      if (err || stats.hasErrors() || stats.hasWarnings()) {
        rej(stats);
        return;
      }
      const location = path.join(findCacheDir({ name: 'storybook' }), 'dll-stats.json');
      const data = JSON.stringify(stats.toJson(), null, 2);

      fs.ensureFileSync(location);
      fs.writeFileSync(location, data, 'utf8');

      res(stats);
    });
  });

const run = () =>
  webpackAsPromised(
    config({
      entry: {
        storybook_ui: [
          '@emotion/core',
          '@emotion/styled',
          '@storybook/addons',
          '@storybook/api',
          '@storybook/components',
          '@storybook/core-events',
          '@storybook/theming',
          'airbnb-js-shims',
          'emotion-theming',
          'prop-types',
          'react',
          'react-dom',
          resolveLocal('../dist/index.js'),
        ],
      },
    })
  );

run().then(
  s => {
    // eslint-disable-next-line no-console
    console.log('success: ', s.toString());
    process.exitCode = 0;
  },
  s => {
    // eslint-disable-next-line no-console
    console.error('failed: ', s.toString());
    process.exitCode = 1;
  }
);
