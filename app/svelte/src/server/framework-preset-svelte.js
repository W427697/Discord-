const path = require('path');

export function webpack(config) {
  // FIXME should find a better resolution algorithm
  const babelRule = config.module.rules[0];
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        // Ensure classes from svelte internals and every svelte component get the
        // same treatment to avoid interop issues between ES5/ES2015 classes.
        //
        // And also, transpile svelte & svelte components down to same ES level as
        // the main app.
        //
        // NOTE This also applies to anything under node_modules (including svelte,
        //      svelte components in addons like centered, etc.).
        {
          include: [{ test: /\.svelte/ }, path.dirname(require.resolve('svelte'))],
          use: babelRule.use,
        },
        {
          test: /\.stories\.svelte$/,
          enforce: 'post',
          use: [
            {
              loader: require.resolve('./svelte-stories-loader'),
            },
            // svelte-stories-loader needs the stories component to be exported as
            // CommonJS in order to be able to dynamically generate exports for CSF.
            //
            // TODO the babel loader could be merged into the main babel for perf
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: ['transform-es2015-modules-commonjs'],
              },
            },
          ],
        },
        {
          test: /\.(?:svelte|html)$/,
          loader: require.resolve('svelte-loader'),
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.svelte'],
      alias: config.resolve.alias,
    },
  };
}
