// eslint-disable-next-line import/no-extraneous-dependencies
import reactTestRenderer from 'react-test-renderer';
import deprecate from 'util-deprecate';

function getRenderedTree(story, context, { renderer, serializer, ...rendererOptions }) {
  if (serializer) deprecate('The "serializer" option of @storybook/addon-storyshots  has been deprecated. Please use "snapshotSerializers: [<your serializer>]" in the future.');

  const storyElement = story.render(context);
  const currentRenderer = renderer || reactTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
