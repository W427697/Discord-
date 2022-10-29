/* eslint-disable no-underscore-dangle */
import * as t from '@babel/types';
import generate from '@babel/generator';
import template from '@babel/template';
import { CsfFile, formatCsf, loadCsf } from './CsfFile';

export const enrichCsf = (csf: CsfFile) => {
  Object.keys(csf._storyExports).forEach((key) => {
    const storyExport = csf.getStoryExport(key);
    const source = extractSource(storyExport);
    const addParameter = template(`
       %%key%%.parameters = { storySource: { source: %%source%% }, ...%%key%%.parameters };
    `)({
      key: t.identifier(key),
      source: t.stringLiteral(source),
    }) as t.Statement;
    csf._ast.program.body.push(addParameter);
  });
};

export const extractSource = (node: t.Node) => {
  const src = t.isVariableDeclarator(node) ? node.init : node;
  const { code } = generate(src, {});
  return code;
};
