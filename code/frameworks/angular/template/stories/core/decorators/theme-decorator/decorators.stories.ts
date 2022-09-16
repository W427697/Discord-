import { Args, componentWrapperDecorator, Meta } from '@storybook/angular';

export default {
  title: 'Core / Decorators / Theme Decorators',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div [class]="myTheme">${story}</div>`,
      // eslint-disable-next-line dot-notation
      ({ globals }) => ({ myTheme: `${globals['theme']}-theme` })
    ),
  ],
} as Meta;

export const Base = (args: Args) => ({
  template: 'Change theme with the brush in toolbar',
  props: {
    ...args,
  },
});
