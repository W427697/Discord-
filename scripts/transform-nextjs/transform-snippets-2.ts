import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { is } from 'unist-util-is';

export const transformPaths = async () => {
  const root = fs.readdirSync('docs');

  const filterRoot = root.filter(
    (dir) =>
      ![
        '_snippets',
        'snippets',
        '.prettierignore',
        '.prettierrc',
        'toc.js',
        'assets',
        'frameworks.js',
      ].includes(dir)
  );

  const files: string[] = [];

  filterRoot.forEach((node) => {
    const isDirectory = fs.lstatSync(`docs/${node}`).isDirectory();
    if (isDirectory) {
      const folder = fs.readdirSync(`docs/${node}`);
      const listOfMarkdownFiles = folder.filter((str) => str.endsWith('.mdx'));
      files.push(...listOfMarkdownFiles.map((file) => path.join(node, file)));
    } else {
      files.push(node);
    }
  });

  files.forEach((file) => {
    if (file !== 'test/test.mdx') return;
    const filePath = path.join('docs', file);
    const markdown = fs.readFileSync(filePath).toString();

    const mdxProcessor = remark().use(remarkMdx) as ReturnType<typeof remark>;
    const rootFile = mdxProcessor.parse(markdown);

    visit(rootFile, (node) => {
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (is(node, { name: 'CodeSnippets' })) {
          console.log(node);

          // const oldPaths = node.attributes.find((attr) => attr.name === 'paths');
          node.attributes = [
            {
              type: 'mdxJsxAttribute',
              name: 'paths',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: JSON.stringify(['bla']),
              },
            },
          ];
        }
      }
    });

    const newMdx = mdxProcessor.stringify(rootFile);
    console.log(newMdx);

    fs.writeFile(filePath, newMdx, (err) => {
      if (err) throw err;
      console.log('The file has been replaced!');
    });
  });
};
