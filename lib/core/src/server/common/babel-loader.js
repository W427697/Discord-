import { excludePaths as exclude } from '../config/utils';

export default options => ({
  test: /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'thread-loader',
    },
    {
      loader: 'babel-loader',
      options,
    },
  ],
  exclude,
});
