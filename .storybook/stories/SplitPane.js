import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { nomargin, content, HSplit } from './_utils';
import SplitPane from '../../';

const stories = storiesOf('SplitPane', module)
  .addDecorator(nomargin);

// ---

stories.add('defaults', function () {
  const props = {};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

[ 'horizontal', 'vertical' ].forEach(split => {
  stories.add('split:'+split, function () {
    const props = {split};
    const children = [ content('p1'), content('p2') ];
    return <SplitPane {...props}>{children}</SplitPane>;
  });
});

[ 'first', 'second' ].forEach(primary => {
  stories.add('primary:'+primary, function () {
    const props = {primary};
    const children = [ content('p1'), content('p2') ];
    return <SplitPane {...props}>{children}</SplitPane>;
  });
});

[
  { parent: 'horizontal', child: 'horizontal' },
  { parent: 'horizontal', child: 'vertical' },
  { parent: 'vertical', child: 'horizontal' },
  { parent: 'vertical', child: 'vertical' },
].forEach(splits => {
  stories.add(`${splits.parent}-${splits.child}`, function () {
    const props1 = { key: 'child', split: splits.child};
    const children1 = [ content('p1'), content('p2') ];
    const splitpane1 = <SplitPane {...props1}>{children1}</SplitPane>;
    const props2 = { key: 'parent', split: splits.parent};
    const children2 = [ content('p3'), splitpane1 ];
    return <SplitPane {...props2}>{children2}</SplitPane>;
  });
});

stories.add('default size', function () {
  const props = {defaultSize: 200};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

stories.add('min/max size', function () {
  const props = {minSize: 200, maxSize: 400};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

stories.add('disable resize', function () {
  const props = {allowResize: false};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

stories.add('change event', function () {
  const props = {onChange: action('change')};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

stories.add('start/end events', function () {
  const props = {onDragStarted: action('start'), onDragFinished: action('end')};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});

stories.add('custom splitter', function () {
  const hsplit = <HSplit header="Split Pane Header" onClose={action('close')} />;
  const props = {split: 'horizontal', resizerChildren: hsplit};
  const children = [ content('p1'), content('p2') ];
  return <SplitPane {...props}>{children}</SplitPane>;
});
