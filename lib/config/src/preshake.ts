import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import recast from 'recast';
import * as typescriptParser from 'recast/parsers/typescript';

const parse = (source: any) =>
  recast.parse(source, {
    parser: typescriptParser,
  });
const stringify = (ast: any) => recast.print(ast);

const preshake = (raw: string, allowed: string[]): string => {
  const options = {
    range: false,
    loc: false,
    comment: false,
    jsx: true,
    useJSXTextNode: true,
  };
  const ast = parse(raw);

  ast.program.body = ast.program.body.filter((i: any) => {
    // export function a() {}
    // export interface Bang {}
    // export type Foo = string | number;
    if (
      i.type === AST_NODE_TYPES.ExportNamedDeclaration &&
      (i.declaration.type === AST_NODE_TYPES.TSTypeAliasDeclaration ||
        i.declaration.type === AST_NODE_TYPES.FunctionDeclaration ||
        i.declaration.type === AST_NODE_TYPES.TSInterfaceDeclaration)
    ) {
      return allowed.includes(i.declaration.id.name);
    }

    // export const manager = {};
    // export const {f,g: h} = {f: 4, g:5};
    if (
      i.type === AST_NODE_TYPES.ExportNamedDeclaration &&
      i.declaration.type === AST_NODE_TYPES.VariableDeclaration
    ) {
      // MUTATION!
      // eslint-disable-next-line no-param-reassign
      i.declaration.declarations = i.declaration.declarations.filter((d: any) => {
        if (d.id.type === AST_NODE_TYPES.ObjectPattern) {
          // MUTATION!
          // eslint-disable-next-line no-param-reassign
          d.id.properties = d.id.properties.filter(
            (p: any) =>
              p.type === AST_NODE_TYPES.Property &&
              p.value.type === AST_NODE_TYPES.Identifier &&
              allowed.includes(p.value.name)
          );
          return !!d.id.properties.length;
        }
        if (d.id.type === AST_NODE_TYPES.Identifier) {
          return allowed.includes(d.id.name);
        }
        return false;
      }, []);

      return !!i.declaration.declarations.length;
    }

    // export { n as b, m as c };
    if (i.type === AST_NODE_TYPES.ExportNamedDeclaration && i.specifiers) {
      return false;
    }

    // export default class Foo {};
    // @ts-ignore (remove after https://github.com/typescript-eslint/typescript-eslint/pull/378 is merged)
    if (i.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
      throw new Error('ExportAllDeclaration is not supported in Storybook config');
      /* This is not supported because we don't have a config property called 'default' */
    }

    // export * from 'foo';
    if (i.type === AST_NODE_TYPES.ExportAllDeclaration) {
      throw new Error('ExportDefaultDeclaration is not supported in Storybook config');
      /* This is not supported because we'd have to recurse into the modules which would add a lot of complexity */
      /* The solution is the make exports explicit */
    }
    return true;
  }, []);

  // @ts-ignore (typescript-eslint => estree)
  return stringify(ast);
};

export { preshake };
