import globalThis from 'global';
import { PartialStoryFn, StoryContext } from '@storybook/csf';

const greetingForLocale = (locale: string) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour !';
    case 'zh':
      return '你好!';
    case 'kr':
      return '안녕하세요!';
    case 'en':
    default:
      return 'Hello';
  }
};

export default {
  component: null,
  decorators: [
    (storyFn: PartialStoryFn, { globals }: StoryContext) => {
      const object = {
        ...globals,
        caption: `Locale is '${globals.locale}', so I say: ${greetingForLocale(globals.locale)}`,
      };
      return storyFn({ component: globalThis.Components.Pre, args: { object: globals } });
    },
  ],
};

export const Basic = {};
