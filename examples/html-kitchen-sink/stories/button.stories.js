import { document } from 'global';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/client-api';

export default {
  title: 'Demo',
  argTypes: {
    buttonText: { control: 'text', defaultValue: 'Click Me' },
  },
};

const Template = ({ buttonText }) => {
  const btn = document.createElement('button');
  btn.innerHTML = buttonText;
  btn.addEventListener('click', action('Click'));
  return btn;
};

export const ButtonWithCustomSourceCode = Template.bind({});

ButtonWithCustomSourceCode.args = {
  buttonText: 'Click Me',
};

ButtonWithCustomSourceCode.parameters = {
  docs: {
    transformSource: (src, id, context) => {
      return Template(context.args).outerHTML;
    },
  },
};

export const Button = Template.bind({});

Button.args = {
  buttonText: 'Click Me',
};

export const Heading = () => '<h1>Hello World</h1>';
export const Headings = () =>
  '<h1>Hello World</h1><h2>Hello World</h2><h3>Hello World</h3><h4>Hello World</h4>';

export const Effect = () => {
  useEffect(() => {
    document.getElementById('button').style.backgroundColor = 'yellow';
  });

  return '<button id="button">I should be yellow</button>';
};
