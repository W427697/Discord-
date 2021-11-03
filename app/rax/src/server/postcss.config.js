/* eslint-disable global-require */

// See https://github.com/postcss/postcss-loader#context-ctx
module.exports = () => {
  return {
    plugins: [
      require('postcss-import'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
      require('postcss-plugin-rpx2vw')(),
    ],
  };
};
