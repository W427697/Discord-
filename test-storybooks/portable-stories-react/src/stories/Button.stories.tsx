import { expect, within, userEvent, fn } from '@storybook/test';
import type { StoryFn as CSF2Story, StoryObj as CSF3Story, Meta } from '@storybook/react';

import type { ButtonProps } from './Button';
import { Button } from './Button';
import { useState } from 'react';

const meta = {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

export default meta;

const Template: CSF2Story<ButtonProps> = (args) => <Button {...args} />;

export const CSF2Secondary = Template.bind({});
CSF2Secondary.args = {
  children: 'Children coming from story args!',
  primary: false,
};

const getCaptionForLocale = (locale: string) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'pt':
      return 'Olá!';
    default:
      return 'Hello!';
  }
};

export const CSF2StoryWithLocale: CSF2Story = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <Button>{caption}</Button>;
};
CSF2StoryWithLocale.storyName = 'WithLocale';

export const CSF2StoryWithParamsAndDecorator: CSF2Story<ButtonProps> = (args) => {
  return <Button {...args} />;
};
CSF2StoryWithParamsAndDecorator.args = {
  children: 'foo',
};
CSF2StoryWithParamsAndDecorator.parameters = {
  layout: 'centered',
};
CSF2StoryWithParamsAndDecorator.decorators = [(StoryFn) => <StoryFn />];

export const CSF3Primary: CSF3Story<ButtonProps> = {
  args: {
    children: 'foo',
    size: 'large',
    primary: true,
  },
};

export const CSF3Button: CSF3Story<ButtonProps> = {
  args: { children: 'foo' },
};

export const CSF3ButtonWithRender: CSF3Story<ButtonProps> = {
  ...CSF3Button,
  render: (args) => (
    <div>
      <p data-testid="custom-render">I am a custom render function</p>
      <Button {...args} />
    </div>
  ),
};

export const CSF3InputFieldFilled: CSF3Story = {
  render: () => {
    const [isClicked, setClicked] = useState(false);
    return <>
      <input data-testid="input" />
      <br/>
      <button onClick={() => setClicked(!isClicked)}>I am {isClicked ? 'clicked' : 'not clicked'}</button>
    </>
  },
  play: async ({ canvasElement, step }) => {
    console.log('start of play function')
    const canvas = within(canvasElement);
    await step('Step label', async () => {
      const inputEl = canvas.getByTestId('input')
      const buttonEl = canvas.getByRole('button')
      await userEvent.click(buttonEl);
      await userEvent.type(inputEl, 'Hello world!');
      await expect(inputEl).toHaveValue('Hello world!');
    });
    console.log('end of play function')
  },
};

const spyFn = fn();
export const LoaderStory: CSF3Story<{ spyFn: (val: string) => string }> = {
  args: {
    spyFn,
  },
  render: (args, { loaded }) => {
    const data = args.spyFn('foo');
    console.log('rendering...')
    return (
      <div>
        <div data-testid="loaded-data">{loaded.value}</div>
        <div data-testid="spy-data">{String(data)}</div>
      </div>
    );
  },
  loaders: [
    async () => {
      console.log('loading...')
      spyFn.mockReturnValueOnce('mocked');
      return {
        value: 'bar',
      };
    },
  ],
  play: async () => {
      console.log('playing...')
      expect(spyFn).toHaveBeenCalledWith('foo');
  },
};
