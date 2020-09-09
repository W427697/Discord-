import type { Configuration } from 'webpack';

export function webpack(config: Configuration) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,

        {
          test: /\.(svelte|html)$/,
          loader: require.resolve('svelte-loader'),
          options: {},
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
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.svelte'],
      alias: config.resolve.alias,
    },
  };
}
