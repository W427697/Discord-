import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

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
    const listOfMarkdownFiles = folder.filter((str) => str.endsWith('.md') || str.endsWith('.mdx'));
    files.push(...listOfMarkdownFiles.map((file) => path.join(node, file)));
  } else {
    files.push(node);
  }
});

// console.log(files);

files.forEach((file) => {
  const filePath = path.join('docs', file);
  const markdown = fs.readFileSync(filePath).toString();

  unified()
    .use(remarkParse)
    .use(() => (tree) => {
      console.log(tree);
      visit(tree, 'jsx', (node) => {
        console.log(node);
        // Modify the node here
        // This is a simplified example and won't work for complex cases.
        // You'll need to write a proper function to find and replace the components.
      });
    })
    .use(stringify)
    .process(markdown, function (err, file) {
      if (err) throw err;
      // fs.writeFileSync(filePath, String(file));
    });
});
