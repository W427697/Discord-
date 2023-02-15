/* eslint-disable no-param-reassign,@typescript-eslint/no-shadow */
import type { API, FileInfo } from 'jscodeshift';
import { babelParse, babelParseExpression } from '@storybook/csf-tools';
import { remark } from 'remark';
import type { Root } from 'remark-mdx';
import remarkMdx from 'remark-mdx';
import { SKIP, visit } from 'unist-util-visit';
import { is } from 'unist-util-is';
import type {
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
} from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import * as t from '@babel/types';
import type { BabelFile } from '@babel/core';
import * as babel from '@babel/core';
import * as recast from 'recast';
import * as path from 'node:path';
import { dedent } from 'ts-dedent';
import { capitalize } from 'lodash';
import prettier from 'prettier';
import { writeFileSync } from 'node:fs';

const mdxProcessor = remark().use(remarkMdx) as ReturnType<typeof remark>;

export default function jscodeshift(info: FileInfo, api: API, options: { parser?: string }) {
  const fileName = path.basename(info.path);
  const [mdx, csf, newFileName] = transform(info.source, fileName);
  writeFileSync(path.join(path.dirname(info.path), newFileName), csf);

  // TODO how to rename the mdx file in jscodeshift?

  return mdx;
}

export function transform(
  source: string,
  filename: string
): [mdx: string, csf: string, newFileName: string] {
  const root = mdxProcessor.parse(source);
  const baseName = filename
    .replace('.stories.mdx', '')
    .replace('story.mdx', '')
    .replace('.mdx', '');

  const stories: (MdxJsxFlowElement | MdxJsxTextElement)[] = [];
  const metaAttributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute> = [];
  const storiesMap = new Map<
    string,
    {
      attributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute>;
      children: (MdxJsxFlowElement | MdxJsxTextElement)['children'];
    }
  >();

  // rewrite addon docs import
  visit(root, ['mdxjsEsm'], (node: MdxjsEsm) => {
    node.value = node.value.replace('@storybook/addon-docs', '@storybook/blocks');
  });

  visit(
    root,
    ['mdxJsxFlowElement', 'mdxJsxTextElement'],
    (node: MdxJsxFlowElement | MdxJsxTextElement, index, parent) => {
      if (is(node, { name: 'Meta' })) {
        metaAttributes.push(...node.attributes);
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'of',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: `${baseName}Stories`,
            },
          },
        ];
      }
      if (is(node, { name: 'Story' })) {
        const storyNode = node.attributes.find((it) =>
          it.type === 'mdxJsxAttribute' ? it.name === 'name' : false
        );

        if (typeof storyNode?.value === 'string') {
          const name = capitalize(storyNode.value);
          storiesMap.set(name, { attributes: node.attributes, children: node.children });
          node.attributes = [
            {
              type: 'mdxJsxAttribute',
              name: 'of',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: `${baseName}Stories.${name}`,
              },
            },
          ];
          stories.push(node);
          node.children = [];
        } else {
          parent.children.splice(index, 1);
          // Do not traverse `node`, continue at the node *now* at `index`.
          return [SKIP, index];
        }
      }
      return undefined;
    }
  );

  const metaProperties = metaAttributes.flatMap((attribute) => {
    if (attribute.type === 'mdxJsxAttribute') {
      if (typeof attribute.value === 'string') {
        return [t.objectProperty(t.identifier(attribute.name), t.stringLiteral(attribute.value))];
      }
      return [
        t.objectProperty(t.identifier(attribute.name), babelParseExpression(attribute.value.value)),
      ];
    }
    return [];
  });

  const file = getEsmAst(root);
  addStoriesImport(root, baseName);

  // remove exports from csf file
  file.path.traverse({
    ImportDeclaration(path) {
      // remove mdx imports from csf
      if (path.node.source.value === '@storybook/blocks') {
        path.remove();
      }
    },
    ExportNamedDeclaration(path) {
      path.replaceWith(path.node.declaration);
    },
  });

  const newStatements: t.Statement[] = [];

  newStatements.push(t.exportDefaultDeclaration(t.objectExpression(metaProperties)));

  function mapChildrenToRender(children: (MdxJsxFlowElement | MdxJsxTextElement)['children']) {
    const child = children[0];

    if (!child) return undefined;

    if (child.type === 'text') {
      return t.arrowFunctionExpression([], t.stringLiteral(child.value));
    }
    if (child.type === 'mdxFlowExpression') {
      const expression = babelParseExpression(child.value);

      // Recreating those liness: https://github.com/storybookjs/mdx1-csf/blob/f408fc97e9a63097ca1ee577df9315a3cccca975/src/sb-mdx-plugin.ts#L185-L198
      const BIND_REGEX = /\.bind\(.*\)/;
      if (BIND_REGEX.test(child.value)) {
        return expression;
      }
      if (t.isIdentifier(expression)) {
        return expression;
      }
      if (t.isArrowFunctionExpression(expression)) {
        return expression;
      }
      return t.arrowFunctionExpression([], expression);
    }

    const expression = babelParseExpression(
      mdxProcessor.stringify({ type: 'root', children: [child] })
    );
    return t.arrowFunctionExpression([], expression);
  }

  storiesMap.forEach((value, key) => {
    const renderProperty = mapChildrenToRender(value.children);
    const newObject = t.objectExpression([
      ...(renderProperty
        ? [t.objectProperty(t.identifier('render'), mapChildrenToRender(value.children))]
        : []),
      ...value.attributes.flatMap((attribute) => {
        if (attribute.type === 'mdxJsxAttribute') {
          if (typeof attribute.value === 'string') {
            return [
              t.objectProperty(t.identifier(attribute.name), t.stringLiteral(attribute.value)),
            ];
          }
          return [
            t.objectProperty(
              t.identifier(attribute.name),
              babelParseExpression(attribute.value.value)
            ),
          ];
        }
        return [];
      }),
    ]);
    newStatements.push(
      t.exportNamedDeclaration(
        t.variableDeclaration('const', [t.variableDeclarator(t.identifier(key), newObject)])
      )
    );
  });

  file.path.node.body = [...file.path.node.body, ...newStatements];

  const newMdx = mdxProcessor.stringify(root);
  let output = recast.print(file.path.node).code;

  const prettierConfig = prettier.resolveConfig.sync('.', { editorconfig: true }) || {
    printWidth: 100,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
  };

  const newFileName = `${baseName}.stories.tsx`;

  output = prettier.format(output, { ...prettierConfig, filepath: newFileName });
  return [newMdx, output, newFileName];
}

function getEsmAst(root: Root) {
  // rewrite imports
  const esm: string[] = [];
  visit(root, ['mdxjsEsm'], (node: MdxjsEsm) => {
    esm.push(node.value);
  });
  const esmSource = `${esm.join('\n\n')}`;

  // @ts-expect-error File is not yet exposed, see https://github.com/babel/babel/issues/11350#issuecomment-644118606
  const file: BabelFile = new babel.File(
    { filename: 'info.path' },
    { code: esmSource, ast: babelParse(esmSource) }
  );
  return file;
}

function addStoriesImport(root: Root, baseName: string): void {
  let found = false;

  visit(root, ['mdxjsEsm'], (node: MdxjsEsm) => {
    if (!found) {
      node.value += '\n';
      node.value += dedent`
        import * as ${baseName}Stories from './${baseName}.stories';
      `;
      found = true;
    }
  });
}
