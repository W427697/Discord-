import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';

import * as R from 'react';

// @ts-ignore - pick off any
const { default: zzz, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ...react } = R;

export const globals: Parameters<typeof globalExternals>[0] = {
  react: {
    varName: '__REACT__',
    namedExports: Object.keys(react),
  },
};
