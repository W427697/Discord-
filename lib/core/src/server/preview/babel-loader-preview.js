import { includePaths, excludePaths } from '../config/utils';
import legacyLoader from '../common/legacy-loader';

export default (options) => [
  {
    test: /\.(mjs|jsx?)$/,
    use: [
      {
        loader: 'babel-loader',
        options,
      },
    ],
    include: includePaths,
    exclude: excludePaths,
  },
  legacyLoader,
];
