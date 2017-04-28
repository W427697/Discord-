import initStoryshots from '../../src';
import path from 'path';

function createNodeMock (element) {
  if (element.type === 'input') {
    return { scrollWidth: 123 };
  }
  return null;
}

initStoryshots({ rendererOptions: { createNodeMock }, configPath: path.resolve(__dirname, '../../.storybook') });
