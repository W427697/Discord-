function webpack(webpackConfig = {}, options = {}) {
	// @ts-ignore
	const { module = {} } = webpackConfig;
	// @ts-ignore
  const { loaderOptions, rule = {} } = options;

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: [/\.stories\.(jsx?$|tsx?$)/],
          ...rule,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('@storybook/source-loader'),
              options: loaderOptions,
            },
          ],
        },
      ],
    },
  };
}

function addons(entry = []) {
  return [...entry, require.resolve('@storybook/addon-live-edit/dist/register.js')];
}

module.exports = { webpack, addons };
