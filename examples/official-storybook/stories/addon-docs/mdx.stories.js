import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import { MDXProvider } from '@mdx-js/react';

import markdown from './markdown.stories.mdx';
import { defaultComponents } from '../../../../addons/docs/src/DocsRenderer';

export default {
  title: 'Addons/Docs/mdx-in-story',
  parameters: { layout: 'fullscreen' },
};

// The purpose of these stories are to document that MDX renders properly in docs itself
// As tools like Chromatic cannot capture docs entries, we need to create a story that
// actually renders it's own docs, much like the DocsRenderer might.
export const Typography = () => {
  const Docs = markdown.parameters.docs.page;
  return <Docs />;
};

Typography.decorators = [
  (storyFn) => (
    <MDXProvider components={defaultComponents}>
      <DocsContainer context={{ componentStories: () => [], storyById: () => ({}) }}>
        {storyFn()}
      </DocsContainer>
    </MDXProvider>
  ),
];

export const DarkModeDocs = () => {
  const Docs = markdown.parameters.docs.page;
  return <Docs />;
};

DarkModeDocs.decorators = [
  (storyFn) => (
    <MDXProvider components={defaultComponents}>
      <DocsContainer
        context={{ componentStories: () => [], storyById: () => ({}) }}
        theme={themes.dark}
      >
        {storyFn()}
      </DocsContainer>
    </MDXProvider>
  ),
];
