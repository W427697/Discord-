import { describe, expect, it } from 'vitest';
import { getJavaScriptTemplateForNewStoryFile } from './javascript';

describe('javascript', () => {
  it('should return a TypeScript template with a default import', () => {
    const result = getJavaScriptTemplateForNewStoryFile({
      basename: 'foo',
      componentExportName: 'default',
      default: true,
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import Component from './foo';

      const meta = {
        component: Component
      }

      export default meta;

      export const Default = {}"
    `);
  });

  it('should return a TypeScript template with a named import', () => {
    const result = getJavaScriptTemplateForNewStoryFile({
      basename: 'foo',
      componentExportName: 'Example',
      default: false,
      exportedStoryName: 'Default',
    });

    expect(result).toMatchInlineSnapshot(`
      "import { Example } from './foo';

      const meta = {
        component: Example
      }

      export default meta;

      export const Default = {}"
    `);
  });
});
