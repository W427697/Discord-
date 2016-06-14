import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from 'react-storybook-story';
import 'react-storybook-story/src/styles.css';

import SplitPane from '../../';
import { nomargin, HSplit } from './_utils';

const stories = storiesOf('SplitPane', module)
  .addDecorator(nomargin);

// ---

stories.add('defaults', function () {
  const info = `
    # <SplitPane />

    ## Defaults

    Render with default properties.

    ~~~jsx
    <SplitPane>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('horizontal', function () {
  const info = `
    # <SplitPane />

    ## Horizontal Split

    Split the container horizontally.

    ~~~jsx
    <SplitPane split='horizontal'>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane split='horizontal'>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

[
  { parent: 'horizontal', child: 'horizontal' },
  { parent: 'horizontal', child: 'vertical' },
  { parent: 'vertical', child: 'horizontal' },
  { parent: 'vertical', child: 'vertical' },
].forEach(splits => {
  stories.add(`${splits.parent}-${splits.child}`, function () {
    const info = `
      # <SplitPane />

      ## Nested Split

      Nest a `+splits.child+` split inside a `+splits.parent+` split.

      ~~~jsx
      <SplitPane split='`+splits.parent+`'>
        <div>pane-1</div>
          <SplitPane split='`+splits.child+`'>
            <div>pane-1</div>
            <div>pane-2</div>
          </SplitPane>
      </SplitPane>
      ~~~
    `;

    return (
      <Story info={info}>
        <SplitPane split={splits.parent}>
          <div>pane-1</div>
            <SplitPane split={splits.child}>
              <div>pane-1</div>
              <div>pane-2</div>
            </SplitPane>
        </SplitPane>
      </Story>
    );
  });
});

stories.add('default-size', function () {
  const info = `
    # <SplitPane />

    ## Default Size

    Split the container with a default size.

    ~~~jsx
    <SplitPane defaultSize={200}>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane defaultSize={300}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('min-max-size', function () {
  const info = `
    # <SplitPane />

    ## Min/Max Size

    Split the container with a minimum and maximum size limit.

    ~~~jsx
    <SplitPane minSize={200} maxSize={400}>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane minSize={200} maxSize={400}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('disable-resize', function () {
  const info = `
    # <SplitPane />

    ## Disable Resize

    Split the container but do not allow resize.

    ~~~jsx
    <SplitPane allowResize={false}>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane allowResize={false}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('event handlers', function () {
  const info = `
    # <SplitPane />

    ## Event Handlers

    The component supports \`drag-started\`, \`drag-finished\` and \`change\` events.

    ~~~jsx
    <SplitPane
      onChange={action('change')}
      onDragStarted={action('started')}
      onDragFinished={action('finished')}>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane
        onChange={action('change')}
        onDragStarted={action('started')}
        onDragFinished={action('finished')}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('custom splitter', function () {
  const info = `
    # <SplitPane />

    ## Custom Splitter

    Use a custom react component for splitter.

    ~~~jsx
    <SplitPane
      split='horizontal'
      resizerChildren={<HSplit header="Header" onClose={action('close')} />}>
      <div>pane-1</div>
      <div>pane-2</div>
    </SplitPane>
    ~~~
  `;

  return (
    <Story info={info}>
      <SplitPane
        split='horizontal'
        resizerChildren={<HSplit header="Header" onClose={action('close')} />}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});
