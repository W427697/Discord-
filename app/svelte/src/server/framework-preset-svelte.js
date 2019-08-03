// NOTE loader options are not used currently, but this variable will serve as
// a reminder that options should probably be mirrored between the two instances
// of svelte-loader, if options are used in the future.
const svelteLoaderOptions = {};

export function webpack(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,

        {
          test: /\.(?:svelte|html)$/,
          exclude: /\.stories\.svelte$/,
          loader: require.resolve('svelte-loader'),
          options: svelteLoaderOptions,
        },

        {
          test: /\.stories\.svelte$/,
          use: [
            {
              loader: require.resolve('./svelte-stories-loader'),
            },
            {
              loader: require.resolve('svelte-loader'),
              options: {
                ...svelteLoaderOptions,
                format: 'cjs',
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
