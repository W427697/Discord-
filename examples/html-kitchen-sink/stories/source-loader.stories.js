import React from 'dom-chef';
import button from './button.html';

const packageName = './button.html';
const componentSubtitle = `import button from '${packageName}/lib/elements/buttons';`;

export default {
  title: 'Addons/Source loader',
  parameters: {
    componentSubtitle,
  },
};

export const Button = () => button;
Button.parameters = {
  storySource: {
    source: `source: ${button}`,
  },
};

export const SimpleStory = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
SimpleStory.storyName = 'Very simple story';

function JSXComponent() {
  return (
    <p>
      <strong>This is a rendered using JSX</strong>
    </p>
  );
}

export const JSXElement = () => <JSXComponent />;
JSXElement.storyName = 'Story using JSX';
