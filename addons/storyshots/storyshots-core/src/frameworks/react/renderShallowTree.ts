// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import shallow from 'react-test-renderer/shallow';

function getRenderedTree(story: any, context: any, { renderer, serializer }: any) {
  const storyElement = React.createElement(story.render);
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(storyElement);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
