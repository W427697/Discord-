// eslint-disable-next-line import/no-extraneous-dependencies
import reactTestRenderer from 'react-test-renderer';

import getChildren from './getChildren';

function getRenderedTree(story: any, context: any, { renderer, ...rendererOptions }: any) {
  const storyElement = getChildren(story.render());
  const currentRenderer = renderer || reactTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);

  return tree;
}

export default getRenderedTree;
