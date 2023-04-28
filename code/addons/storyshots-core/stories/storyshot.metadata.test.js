import path from 'path';
import initStoryshots from '../src';

// jest.mock('@junk-temporary-prototypes/node-logger');

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, 'exported_metadata'),
});
