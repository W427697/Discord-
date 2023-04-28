import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '../src';

jest.mock('@junk-temporary-prototypes/node-logger');

// with react-test-renderer
initStoryshots({
  framework: 'react',
  // Ignore integrityOptions for async.storyshot because only run when asyncJest is true
  integrityOptions: { cwd: __dirname, ignore: ['**/**.async.storyshot'] },
  configPath: path.join(__dirname, 'exported_metadata'),
  test: multiSnapshotWithOptions(),
});
