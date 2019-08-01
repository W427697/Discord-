export type Framework =
  | 'react'
  | 'angular'
  | 'vue'
  | 'html'
  | 'riot'
  | 'polymer'
  | 'ember'
  | 'mithril'
  | 'react-native';

const getFrameworkLib = async (framework: Framework) => {
  if (framework === 'react') {
    // @ts-ignore
    return import('@storybook/react');
  }

  return null;
};

export const add = async (
  framework: Framework,
  { title, stories, module: m, decorators = [], parameters = {} }: any
) => {
  const lib = await getFrameworkLib(framework);

  if (framework && lib && title) {
    const { storiesOf } = lib;

    const story = storiesOf(title, m);

    // @ts-ignore TODO, this should actually be typed!
    decorators.forEach(d => {
      story.addDecorator(d);
    });

    story.addParameters(parameters);

    Object.entries(stories).forEach(([k, v]) => {
      // @ts-ignore TODO, this should actually be typed!
      story.add(v.name || v.title || k, v, v.parameters || {});
    });
  } else {
    // console.log(framework, { title, stories, module: m, decorators, parameters });
  }
};
