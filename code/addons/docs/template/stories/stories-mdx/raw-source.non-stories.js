import { RawSource as RawSourceComponent } from './RawSource.jsx';
// eslint-disable-next-line import/no-unresolved
import RawSourceCode from './RawSource.jsx?raw';

export const RawSource = RawSourceComponent.bind({});

RawSource.parameters = {
  docs: {
    source: {
      code: RawSourceCode,
      language: 'tsx',
      type: 'code',
    },
  },
};
