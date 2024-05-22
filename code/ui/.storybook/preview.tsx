import { global } from '@storybook/global';
import React, { useEffect } from 'react';
import { Global, ThemeProvider, themes, createReset, convert, useTheme } from '@storybook/theming';
import { useArgs, DocsContext as DocsContextProps } from '@storybook/preview-api';
import type { PreviewWeb } from '@storybook/preview-api';
import type { ReactRenderer } from '@storybook/react';
import type { Channel } from '@storybook/channels';
import { withThemeByClassName } from '@storybook/addon-themes';
import { DocsContext } from '@storybook/blocks';
import { DocsPageWrapper } from '../blocks/src/components';

const { document } = global;

const ThemedSetRoot = () => {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.background = theme.background.content;
    document.body.style.color = theme.color.defaultText;
  }, []);

  return null;
};

// eslint-disable-next-line no-underscore-dangle
const preview = (window as any).__STORYBOOK_PREVIEW__ as PreviewWeb<ReactRenderer>;
const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__ as Channel;
export const loaders = [
  /**
   * This loader adds a DocsContext to the story, which is required for the most Blocks to work.
   * A story will specify which stories they need in the index with:
   * parameters: {
   *  relativeCsfPaths: ['../stories/MyStory.stories.tsx'], // relative to the story
   * }
   * The DocsContext will then be added via the decorator below.
   */
  async ({ parameters: { relativeCsfPaths, attached = true } }) => {
    if (!relativeCsfPaths) return {};
    const csfFiles = await Promise.all(
      (relativeCsfPaths as string[]).map(async (blocksRelativePath) => {
        const projectRelativePath = `./ui/blocks/src/${blocksRelativePath.replace(
          /^..\//,
          ''
        )}.tsx`;
        const entry = preview.storyStore.storyIndex?.importPathToEntry(projectRelativePath);

        if (!entry) {
          throw new Error(
            `Couldn't find story file at ${projectRelativePath} (passed as ${blocksRelativePath})`
          );
        }

        return preview.storyStore.loadCSFFileByStoryId(entry.id);
      })
    );
    const docsContext = new DocsContextProps(
      channel,
      preview.storyStore,
      preview.renderStoryToElement.bind(preview),
      csfFiles
    );
    if (attached && csfFiles[0]) {
      docsContext.attachCSFFile(csfFiles[0]);
    }
    return { docsContext };
  },
];

export const decorators = [
  // This decorator adds the DocsContext created in the loader above
  (Story, { loaded: { docsContext } }) =>
    docsContext ? (
      <DocsContext.Provider value={docsContext}>
        <Story />
      </DocsContext.Provider>
    ) : (
      <Story />
    ),
  /**
   * This decorator sets the theme based on the new CSS custom properties API
   * In preview-head.html, CSS properties are set based on the class on the html element
   */
  withThemeByClassName({
    themes: {
      Light: 'theme-light',
      Dark: 'theme-dark',
      Green: 'theme-green',
      Red: 'theme-red',
      Yellow: 'theme-yellow',
    },
    defaultTheme: 'Light',
  }),
  /**
   * This decorator adds wrappers that contains global styles for stories to be targeted by.
   * Activated with parameters.docsStyles = true
   */ (Story, { parameters: { docsStyles } }) =>
    docsStyles ? (
      <DocsPageWrapper>
        <Story />
      </DocsPageWrapper>
    ) : (
      <Story />
    ),
  /**
   * This decorator renders the stories side-by-side, stacked or default based on the theme switcher in the toolbar
   */
  (StoryFn) => {
    return (
      <ThemeProvider theme={convert(themes.light)}>
        <Global styles={createReset} />
        <ThemedSetRoot />
        <StoryFn />
      </ThemeProvider>
    );
  },
  /**
   * This decorator shows the current state of the arg named in the
   * parameters.withRawArg property, by updating the arg in the onChange function
   * this also means that the arg will sync with the control panel
   *
   * If parameters.withRawArg is not set, this decorator will do nothing
   */
  (StoryFn, { parameters, args }) => {
    const [, updateArgs] = useArgs();
    if (!parameters.withRawArg) {
      return <StoryFn />;
    }

    return (
      <>
        <StoryFn
          args={{
            ...args,
            onChange: (newValue) => {
              updateArgs({ [parameters.withRawArg]: newValue });
              args.onChange?.(newValue);
            },
          }}
        />
        <div style={{ marginTop: '1rem' }}>
          Current <code>{parameters.withRawArg}</code>:{' '}
          <pre>{JSON.stringify(args[parameters.withRawArg], null, 2) || 'undefined'}</pre>
        </div>
      </>
    );
  },
];

export const parameters = {
  options: {
    storySort: (a, b) =>
      a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),
  },
  docs: {
    theme: themes.light,
    toc: {},
  },
  controls: {
    presetColors: [
      { color: '#ff4785', title: 'Coral' },
      { color: '#1EA7FD', title: 'Ocean' },
      { color: 'rgb(252, 82, 31)', title: 'Orange' },
      { color: 'RGBA(255, 174, 0, 0.5)', title: 'Gold' },
      { color: 'hsl(101, 52%, 49%)', title: 'Green' },
      { color: 'HSLA(179,65%,53%,0.5)', title: 'Seafoam' },
      { color: '#6F2CAC', title: 'Purple' },
      { color: '#2A0481', title: 'Ultraviolet' },
      { color: 'black' },
      { color: '#333', title: 'Darkest' },
      { color: '#444', title: 'Darker' },
      { color: '#666', title: 'Dark' },
      { color: '#999', title: 'Mediumdark' },
      { color: '#ddd', title: 'Medium' },
      { color: '#EEE', title: 'Mediumlight' },
      { color: '#F3F3F3', title: 'Light' },
      { color: '#F8F8F8', title: 'Lighter' },
      { color: '#FFFFFF', title: 'Lightest' },
      '#fe4a49',
      '#FED766',
      'rgba(0, 159, 183, 1)',
      'HSLA(240,11%,91%,0.5)',
      'slategray',
    ],
  },
};
