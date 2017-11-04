/* global document */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// import {
//   withKnobs,
//   addonKnobs,
//   text,
//   number,
//   boolean,
//   color,
//   select,
//   array,
//   date,
//   object,
// } from '@storybook/addon-knobs';

import { setOptions } from '@storybook/addon-options';

const textButton = (size, bgcolor, isText = true) => () => (
  <button
    style={{
      color: 'white',
      border: '2px solid darkgray',
      borderRadius: 8,
      padding: 6 + size,
      paddingTop: 6,
      paddingBottom: 6,
      margin: 20,
      fontSize: size,
      backgroundColor: bgcolor,
      cursor: 'pointer',
    }}
    size={size}
    color={bgcolor}
    onClick={action(`${bgcolor} button with ${isText ? 'text' : 'train'}`)}
  >
    {isText ? 'Press me!' : '🚂🚃🚃🚃🚃🚃🚃🚃🚃'}
  </button>
);

const decorStyle = (isEmoji, isTile) => ({
  borderTop: '1px solid rgba(255, 255, 255, 1)',
  borderBottom: '1px solid rgba(128, 128, 128, 0.4)',
  backgroundColor: isEmoji ? 'rgba(230, 255, 240, 0.5)' : 'rgba(230, 240, 255, 0.5)',
  marginBottom: 16,
  marginRight: 26,
  minWidth: isTile ? 260 : '',
  minHeight: isTile ? 156 : '',
});

const storyTitleStyle = isSelected => ({
  fontFamily: 'sans-serif',
  fontSize: 30,
  fontVariantCaps: 'small-caps',
  color: isSelected ? 'rgb(20, 20, 20)' : 'rgba(90, 90, 90, 0.7)',
  margin: 4,
  fontWeight: isSelected ? 'bold' : '',
  cursor: 'pointer',
});

const storyContextStyle = isSelected => ({
  fontFamily: 'sans-serif',
  fontSize: 14,
  color: isSelected ? 'rgba(20, 20, 20, 0.8)' : 'rgba(90, 90, 90, 0.5)',
  margin: 4,
});

const guideDecorator = (isEmoji = false, isTile = false) => (storyfn, context) => {
  context.onStoryDidMount(id => {
    const currentStoryHolder = document.getElementById(id);
    if (currentStoryHolder) currentStoryHolder.scrollIntoView();
  });

  return (
    <div style={decorStyle(isEmoji, isTile)}>
      <a onClick={linkTo(context.kind, context.story)} role="link" tabIndex="0">
        <h1 style={storyTitleStyle(context.story === context.selectedStory)}>{context.story}</h1>
      </a>
      <p style={storyContextStyle(context.story === context.selectedStory)}>
        {context.kind.replace(context.kindRoot, '').replace(/^\./, '') || context.kind}
      </p>
      {storyfn()}
    </div>
  );
};

const normalDecorator = stories => <div>{stories}</div>;

// const tileDecorator = stories => (
//   <div>
//     <h1>Button Tiles</h1>
//     <div
//       style={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         alignItems: 'stretch',
//       }}
//     >
//       {stories}
//     </div>
//   </div>
// );

storiesOf('Buttons Guide:.simple', module)
  .addDecorator(guideDecorator())
  .add('normal small', () => {
    setOptions({
      previewDecorator: normalDecorator,
    });
    return textButton(10, 'coral')();
  })
  .add('normal big', textButton(14, 'coral'))
  .add('normal enormous', textButton(18, 'coral'))
  .add('normal giant', textButton(26, 'coral'))
  .add('accent small', textButton(10, 'crimson'))
  .add('accent big', textButton(14, 'crimson'))
  .add('accent enormous', textButton(18, 'crimson'))
  .add('accent giant', textButton(26, 'crimson'))
  .add('disabled small', textButton(10, 'gray'))
  .add('disabled big', textButton(14, 'gray'))
  .add('disabled enormous', textButton(18, 'gray'))
  .add('disabled giant', textButton(26, 'gray'));

// storiesOf('Buttons Guide:.emoji', module)
//   .addDecorator(guideDecorator(true))
//   .add('normal small', textButton(18, 'coral', false))
//   .add('normal big', textButton(22, 'coral', false))
//   .add('normal enormous', textButton(28, 'coral', false))
//   .add('normal giant', textButton(36, 'coral', false))
//   .add('accent small', textButton(18, 'crimson', false))
//   .add('accent big', textButton(22, 'crimson', false))
//   .add('accent enormous', textButton(28, 'crimson', false))
//   .add('accent giant', textButton(36, 'crimson', false))
//   .add('disabled small', textButton(18, 'gray', false))
//   .add('disabled big', textButton(22, 'gray', false))
//   .add('disabled enormous', textButton(28, 'gray', false))
//   .add('disabled giant', textButton(36, 'gray', false));

// storiesOf('Buttons Guide.tile:', module)
//   .addDecorator(guideDecorator(false, true))
//   .add('normal small', () => {
//     setOptions({
//       previewDecorator: tileDecorator,
//     });
//     return textButton(10, 'coral')();
//   })
//   .add('normal big', textButton(14, 'coral'))
//   .add('normal enormous', textButton(18, 'coral'))
//   .add('normal giant', textButton(26, 'coral'))
//   .add('accent small', textButton(10, 'crimson'))
//   .add('accent big', textButton(14, 'crimson'))
//   .add('accent enormous', textButton(18, 'crimson'))
//   .add('accent giant', textButton(26, 'crimson'))
//   .add('disabled small', textButton(10, 'gray'))
//   .add('disabled big', textButton(14, 'gray'))
//   .add('disabled enormous', textButton(18, 'gray'))
//   .add('disabled giant', textButton(26, 'gray'));
