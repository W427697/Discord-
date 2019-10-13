// eslint-disable-next-line import/no-extraneous-dependencies
import shallow from 'react-test-renderer/shallow';

import getChildren from './getChildren';

function getRenderedTree(story: any, context: any, { renderer, serializer }: any) {
  const storyElement = getChildren(story.render());
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(storyElement);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
