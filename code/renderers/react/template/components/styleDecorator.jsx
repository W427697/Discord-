import React from 'react';

export function styleDecorator(style) {
  return (StoryFn) => (
    <div style={style}>
      <StoryFn />
    </div>
  );
}
