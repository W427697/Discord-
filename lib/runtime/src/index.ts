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
    return import('@storybook/react');
  }

  return null;
};

export const add = async (framework: Framework, { title, stories, module: m }: any) => {
  console.log('add', { title, stories });

  const lib = await getFrameworkLib(framework);

  if (framework && lib) {
    const { storiesOf } = lib;

    const story = storiesOf(title, m);

    Object.entries(stories).forEach(([k, v]) => {
      story.add(k, v);
    });
  }
};
