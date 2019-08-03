import path from 'path';
import fse from 'fs-extra';
import resolve from 'enhanced-resolve';
import * as t from '@babel/types';
import generate from '@babel/generator';
import traverse, { TraverseOptions, NodePath } from '@babel/traverse';
import { transformFileSync } from '@babel/core';
import { createAST } from '../__helper__/plugin-test';

const targeted = /addons|presets/;

export const detectSubConfigs = (ast: t.File): string[] => {
  const result: string[] = [];
  ast.program.body.forEach(i => {
    if (t.isExportNamedDeclaration(i)) {
      if (t.isVariableDeclaration(i.declaration)) {
        //
        const target = i.declaration.declarations.find(d => {
          const { id } = d;
          return !!(t.isIdentifier(id) && id.name.match(targeted));
        });

        if (target && t.isArrayExpression(target.init)) {
          const { init } = target;
          init.elements.forEach(e => {
            if (t.isStringLiteral(e)) {
              result.push(e.value);
            }
          });
        }
      }
    }
  });

  return result;
};

export const removeSubConfigRefs = (): TraverseOptions => {
  return {
    ExportNamedDeclaration(p) {
      const declaration = p.get('declaration');

      if (declaration.isVariableDeclaration()) {
        const declarations = declaration.get('declarations');

        const target = declarations.find(d => {
          const id = d.get('id');
          return !!(id.isIdentifier() && id.node.name.match(targeted));
        });

        if (target && t.isIdentifier(target.node.id)) {
          const { init } = target.node;
          if (t.isArrayExpression(init)) {
            init.elements.forEach(e => {
              if (t.isStringLiteral(e)) {
                p.remove();
              }
            });
          }
        }
      }
    },
  };
};

export const getCorrectPath = (from: string, ref: string): Promise<string> => {
  const fromDir = path.dirname(from);
  return new Promise((res, rej) => {
    if (path.isAbsolute(ref)) {
      res(ref);
    } else {
      resolve(fromDir, ref, (e, r) => {
        if (e) {
          rej(e);
        } else {
          res(r);
        }
      });
    }
  });
};

export const collectSubConfigs = async (files: string[]): Promise<string[]> => {
  const x = Promise.all(
    files.map(async f => {
      const source = await fse.readFile(f, 'utf8');
      const ast = createAST(source);
      const refs = await Promise.all(
        detectSubConfigs(ast).map(async ref => getCorrectPath(f, ref))
      );

      return collectSubConfigs(refs);
    })
  );
  const list = [...files, ...(await x)];

  return list.reduce<string[]>((acc, i) => acc.concat(i), []);
};

const findMatchingDeclaration = (p: NodePath<t.Statement>, name: string) => {
  if (p.isExportNamedDeclaration()) {
    const declaration = p.get('declaration');
    if (declaration.isVariableDeclaration()) {
      const declarations = declaration.get('declarations');
      return declarations.find(d => {
        const { id } = d.node;
        return t.isIdentifier(id) && id.name === name;
      });
    }
  }
  return null;
};

const findMatchingExport = (combined: NodePath<t.Program>, name: string) => {
  return combined.get('body').find(p => {
    return findMatchingDeclaration(p, name);
  });
};

const doSomethingScopeMagic = (
  combined: NodePath<t.Program>,
  value: NodePath<t.VariableDeclarator>
) => {
  // get relevant bindings, other exports don't count
  const bindings = Object.entries(value.scope.bindings)
    .filter(([k, v]) => !v.path.parentPath.parentPath.isExportNamedDeclaration())
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v.path.parentPath }), {});

  const used = {};

  value.traverse({
    Identifier(p) {
      // @ts-ignore
      if (bindings[p.node.name]) {
        // @ts-ignore
        used[p.node.name] = bindings[p.node.name];
      }
    },
  });

  Object.entries(used).forEach(([k, v]) => {
    const id = combined.scope.generateUid(k);
    // @ts-ignore
    v.scope.rename(k, id);
    // @ts-ignore
    combined.unshiftContainer('body', v.node);
  });
};

const appendToExport = (p: NodePath<t.Statement>, d: NodePath<t.VariableDeclarator>) => {
  const { id, init } = d.node;
  if (t.isIdentifier(id)) {
    const match = findMatchingDeclaration(p, id.name);

    // @ts-ignore
    match.get('init').pushContainer('elements', init);
  }
};

const createExport = (combined: NodePath<t.Program>, d: NodePath<t.VariableDeclarator>) => {
  const { id, init } = d.node;
  if (t.isIdentifier(id)) {
    // @ts-ignore
    combined.pushContainer(
      'body',
      t.exportNamedDeclaration(
        t.variableDeclaration('const', [t.variableDeclarator(id, t.arrayExpression([init]))]),
        [],
        null
      )
    );
  }
};

const addToCombined = (combined: NodePath<t.Program>) => (
  p: NodePath<t.ExportNamedDeclaration>
) => {
  const declaration = p.get('declaration');

  if (declaration.isVariableDeclaration()) {
    const declarations = declaration.get('declarations');

    declarations.forEach(d => {
      const { id, init } = d.node;
      if (t.isIdentifier(id)) {
        const { name } = id;

        const match = findMatchingExport(combined, name);

        if (match) {
          appendToExport(match, d);
        } else {
          createExport(combined, d);
        }

        doSomethingScopeMagic(combined, d);
      }
    });
  }

  return combined;
};

const createCombinated = (): { ast: t.File; collected: NodePath<t.Program> | undefined } => {
  let collected;
  const ast = createAST('');

  traverse(ast, {
    Program: {
      enter(p) {
        collected = p;
      },
    },
  });

  return { ast, collected };
};

function onlyUnique(value: unknown, index: unknown, self: unknown[]) {
  return self.indexOf(value) === index;
}

export const collector = async (files: string[]) => {
  const { collected, ast } = createCombinated();
  const add = addToCombined(collected);

  files.filter(onlyUnique).forEach(f =>
    transformFileSync(f, {
      configFile: false,
      retainLines: true,
      compact: false,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        function removeSubConfigRefsPlugin() {
          return { visitor: removeSubConfigRefs() };
        },
        function removeSubConfigRefsPlugin() {
          const visitor: TraverseOptions = {
            ExportNamedDeclaration(p) {
              add(p);
            },
          };
          return {
            visitor,
          };
        },
        'minify-dead-code-elimination',
        'babel-plugin-danger-remove-unused-import',
        '@wordpress/babel-plugin-import-jsx-pragma',
      ],
    })
  );

  return generate(ast, {}, '');
};
