import { within, expect } from '@storybook/test';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';

/**
 * This component is used to display the resolved version of React and its related packages.
 * As long as `@storybook/addon-docs` is installed, `react` and `react-dom` should be available to import from and should resolve to the same version.
 *
 * The autodocs here ensures that it also works in the generated documentation.
 *
 * - See the [MDX docs](/docs/addons-docs-docs2-resolvedreact--mdx) for how it resolves in MDX.
 * - See the [Story](/story/addons-docs-docs2-resolvedreact--story) for how it resolves in the actual story.
 *
 * **Note: There appears to be a bug in the _production_ build of `react-dom`, where it reports version `18.2.0-next-9e3b772b8-20220608` while in fact version `18.2.0` is installed.**
 */
export default {
  title: 'Docs2/ResolvedReact',
  component: globalThis.Components.Html,
  tags: ['autodocs'],
  argTypes: {
    content: { table: { disable: true } },
  },
  loaders: async () => {
    // this hack is needed because preact compat does not provide a version for react-dom/server
    return {
      reactDomServerVersion:
        (await import('react-dom/server')).version ||
        'The export does not provide a version for this renderer.',
    };
  },
  decorators: (StoryFn: any, { args, loaded }: any) => {
    return StoryFn({
      args: {
        ...args,
        content: args.content.replace('{{server-version}}', loaded.reactDomServerVersion),
      },
    });
  },
  args: {
    content: `
      <p>
        <code>react</code>: <code data-testid="react">${reactVersion}</code>
      </p>
      <p>
        <code>react-dom</code>: <code data-testid="react-dom">${reactDomVersion}</code>
      </p>
      <p>
        <code>react-dom/server</code>: <code data-testid="react-dom-server">{{server-version}}</code>
      </p>
  `,
  },
  parameters: {
    docs: {
      name: 'ResolvedReact',
    },
  },
};

export const Story = {
  // This test is more or less the same as the E2E test we have for MDX and autodocs entries in addon-docs.spec.ts
  play: async ({ canvasElement, step }: any) => {
    const canvas = await within(canvasElement);

    const actualReactVersion = (await canvas.findByTestId('react')).textContent;
    const actualReactDomVersion = (await canvas.findByTestId('react-dom')).textContent;
    const actualReactDomServerVersion = await (
      await canvas.findByTestId('react-dom-server')
    ).textContent;

    step('Expect React packages to all resolve to the same version', () => {
      // react-dom has a bug in its production build, reporting version 18.2.0-next-9e3b772b8-20220608 even though version 18.2.0 is installed.
      expect(actualReactDomVersion?.startsWith(actualReactDomVersion)).toBeTruthy();
      expect(actualReactVersion).toBe(actualReactDomServerVersion);
    });
  },
};
