import path from 'path';
import initStoryshots, { shallowSnapshot } from '../dist/types';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, 'exported_metadata'),
  test: (data) =>
    shallowSnapshot({
      ...data,
    }),
});
