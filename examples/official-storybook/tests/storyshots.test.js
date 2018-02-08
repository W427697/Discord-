import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import { render as renderer } from 'enzyme';
import serializer from 'enzyme-to-json';

// HTML Snapshots
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '../'),
  storyKindRegex: /^(?!Other\|Error Overlay Example$)/,
  test: multiSnapshotWithOptions({
    renderer,
    serializer,
  }),
});
