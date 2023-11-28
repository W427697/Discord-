import { RawSource as RawSourceComponent } from './RawSource.jsx';
// eslint-disable-next-line import/no-unresolved
import RawSourceCode from './RawSource.jsx?raw';

export default {
  component: RawSourceComponent,
};

export const RawSource = {
  parameters: {
    docs: {
      source: {
        code: RawSourceCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
