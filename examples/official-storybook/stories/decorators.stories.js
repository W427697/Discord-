import React from 'react';
import { storiesOf } from '@storybook/react';

const outerDecorator = (story, context) => {
  let storyRef;
  const renderedStory = story({
    ...context,
    ref: r => {
      storyRef = r;
    },
  });

  console.log(storyRef);
  return (
    <div>
      <h1>The story rendered a {storyRef.tagname}</h1>
      {renderedStory}
    </div>
  );
};

const innerDecorator = (story, context) => <section>{story(context)}</section>;

storiesOf('Core|Decorators', module)
  .addDecorator(outerDecorator)
  .addDecorator(innerDecorator)
  .add('a span', () => <span>The story!</span>);
