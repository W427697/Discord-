import dedent from 'ts-dedent';
import { Markdown } from './Markdown';
import mdContent from '../examples/Markdown-content.md?raw';

export default {
  component: Markdown,
};

export const MarkdownString = {
  args: {
    children: dedent`
    # A heading

    Paragraph with an \`inline code\` block.

    \`\`\`js
    const jsCodeBlock = true;
    \`\`\`

    <h3>Native h3 element</h3>

    [external link](https://storybook.js.org)

    { brackets, valid MD but invalid MDX - works here }
    
    <Looks like a JSX tag/>
    <!-- above is valid MD but invalid in markdown-to-jsx, so it will not be rendered -->

    \`<Looks like a JSX tag />\`

    The above is only visible because it is wrapped in backticks
    `,
  },
};

/**
 * The Markdown component won't know the difference between getting a raw string
 * and something imported from a .md file.
 * So this story doesn't actually test the component, but rather the import
 * at the top of the CSF file
 */
export const ImportedMDFile = {
  name: 'Imported .md file',
  args: { children: mdContent },
};
