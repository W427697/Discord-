/* eslint-disable no-underscore-dangle */
import * as t from '@babel/types';
import { traverse } from '@babel/core';
import { createUnplugin } from 'unplugin';
import type { CsfFile } from '@storybook/csf-tools';
import { loadCsf, formatCsf } from '@storybook/csf-tools';

const logger = console;

const STORIES_REGEX = /\.(story|stories)\.[tj]sx?$/;

type TransformOptions = {};

const transformCsf = (csf: CsfFile, options: TransformOptions) => {
  const meta = csf._metaNode;
  if (t.isObjectExpression(meta)) {
    const idx = meta.properties.findIndex(
      (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'component'
    );
    if (idx >= 0) {
      const prop = meta.properties[idx] as t.ObjectProperty;
      const componentId = t.isIdentifier(prop.value) ? prop.value.name : undefined;

      if (componentId) {
        traverse(csf._ast, {
          TSTypeQuery(path) {
            if (t.isIdentifier(path.node.exprName) && path.node.exprName.name === componentId) {
              path.replaceWith(t.tsAnyKeyword());
            }
          },
        });
        const { body } = csf._ast.program;
        const importIdx = body.findIndex(
          (n) => t.isImportDeclaration(n) && n.specifiers.find((s) => s.local.name === componentId)
        );
        if (importIdx >= 0) {
          const importDecl = body[importIdx] as t.ImportDeclaration;
          const specifierIdx = importDecl.specifiers.findIndex((s) => s.local.name === componentId);
          importDecl.specifiers.splice(specifierIdx, 1);
          if (!importDecl.specifiers.length) {
            body.splice(importIdx, 1);
          }
        }
      }

      meta.properties.splice(idx, 1);
    }
  }
  return csf;
};

export const transformCode = (
  code: string,
  options: TransformOptions
): { code: string; map?: any } => {
  try {
    const csf = loadCsf(code, { makeTitle: (userTitle) => userTitle || 'default' }).parse();
    transformCsf(csf, options);
    const transformed = formatCsf(csf, { sourceMaps: true });
    return transformed as { code: string; map: any };
  } catch (err: any) {
    // This can be called on legacy storiesOf files, so just ignore
    // those errors. But warn about other errors.
    if (!err.message?.startsWith('CSF:')) {
      logger.warn(err.message);
    }
  }
  return { code };
};

export const unplugin = createUnplugin<TransformOptions>((options) => {
  return {
    name: 'unplugin-nextjs',
    transformInclude(id) {
      return STORIES_REGEX.test(id);
    },
    async transform(code, id) {
      return transformCode(code, options);
    },
  };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
