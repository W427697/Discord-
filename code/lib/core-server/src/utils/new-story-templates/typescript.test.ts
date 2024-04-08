import { describe, expect, it } from 'vitest';
import { getTypeScriptTemplateForNewStoryFile } from './typescript';

describe('typescript', () => {
  it('should return a TypeScript template with a default import', () => {
    const result = getTypeScriptTemplateForNewStoryFile({
      basename: 'foo',
      componentExportName: 'default',
      default: true,
      frameworkPackageName: '@storybook/nextjs',
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import type { Meta, StoryObj } from '@storybook/nextjs';

      import Component from './foo';

      const meta = {
        component: Component
      } satisfies Meta<typeof Component>

      export default meta;

      type Story = StoryObj<typeof meta>;

      export const Default: Story = {}"
    `);
  });

  it('should return a TypeScript template with a named import', () => {
    const result = getTypeScriptTemplateForNewStoryFile({
      basename: 'foo',
      componentExportName: 'Example',
      default: false,
      frameworkPackageName: '@storybook/nextjs',
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import type { Meta, StoryObj } from '@storybook/nextjs';

      import { Example } from './foo';

      const meta = {
        component: Example
      } satisfies Meta<typeof Example>

      export default meta;

      type Story = StoryObj<typeof meta>;

      export const Default: Story = {}"
    `);
  });
});
