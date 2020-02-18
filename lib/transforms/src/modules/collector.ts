/* eslint-disable @typescript-eslint/ban-ts-ignore */
import path from 'path';
import fse from 'fs-extra';
import resolve from 'enhanced-resolve';
import * as t from '@babel/types';
import generate from '@babel/generator';
import traverse, { TraverseOptions, NodePath, Binding } from '@babel/traverse';
import { transformFileSync } from '@babel/core';
import { createAST } from '../__helper__/plugin-test';

const targeted = /addons|presets/;

const resolveSync = resolve.create.sync({
  extensions: ['.ts', '.js'],
});
const resolveAsync = resolve.create({
  extensions: ['.ts', '.js'],
});

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
      const declaration = p.get('declaration') as NodePath<t.Declaration>;

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
              if (t.isStringLiteral(e) && !p.removed) {
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
      resolveAsync(fromDir, ref, (e, r) => {
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
  const list = [...(await x), ...files];

  return list.reduce<string[]>((acc, i) => acc.concat(i), []);
};

const findMatchingDeclaration = (p: NodePath<t.Statement>, name: string) => {
  if (p.isExportNamedDeclaration()) {
    const declaration = p.get('declaration') as NodePath<t.Declaration>;
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
    return !!findMatchingDeclaration(p, name);
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
  const declaration = p.get('declaration') as NodePath<t.Declaration>;

  if (declaration.isVariableDeclaration()) {
    const declarations = declaration.get('declarations');

    declarations.forEach(d => {
      const { id } = d.node;
      if (t.isIdentifier(id)) {
        const { name } = id;

        const match = findMatchingExport(combined, name);

        if (match) {
          appendToExport(match, d);
        } else {
          createExport(combined, d);
        }
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

  const allRefs = await collectSubConfigs(files);
  const scopeAddedNodes: Node[] = [];

  const unique = allRefs.filter(onlyUnique);

  // TODO: refactor to async
  unique.forEach(f =>
    transformFileSync(f, {
      configFile: false,
      retainLines: true,
      compact: false,
      plugins: [
        '@babel/plugin-syntax-typescript',
        '@babel/plugin-syntax-dynamic-import',
        function removeSubConfigRefsPlugin() {
          return { visitor: removeSubConfigRefs() };
        },
        function absoluteImportsPlugin() {
          const dir = path.dirname(f);

          const visitor: TraverseOptions = {
            ImportDeclaration(p) {
              const n = p.get('source');
              const { value } = n.node;

              try {
                const result = resolveSync(dir, value);

                n.replaceWith(t.stringLiteral(result));
              } catch (e) {
                //
              }
            },
            CallExpression(p) {
              if (p.node.callee.type === 'Import') {
                try {
                  const args = p.get('arguments');

                  args.forEach(a => {
                    if (a.isStringLiteral()) {
                      const result = resolveSync(dir, a.node.value);
                      a.replaceWith(t.stringLiteral(result));
                    }
                  });
                } catch (e) {
                  //
                }
              }
            },
          };
          return {
            visitor,
          };
        },
        function collectorPlugin() {
          const visitor: TraverseOptions = {
            ExportNamedDeclaration(p) {
              add(p);
            },
          };
          return {
            visitor,
          };
        },
        function copyUsedScopePlugin() {
          const allowed: { [k: string]: Binding['path'] } = {};
          const list: { [k: string]: Binding['path'] } = {};

          const findRootStatementUp = (p: NodePath, boundary: NodePath): null | NodePath => {
            if (p.parentPath && p.parentPath === boundary) {
              return null;
            }
            if (p.parentPath && p.parentPath.isProgram()) {
              return p;
            }
            if (p.parentPath) {
              return findRootStatementUp(p.parentPath, boundary);
            }
            throw new Error('statement cannot be found');
          };

          const recurseUp = (p: NodePath, name: string, boundary?: NodePath) => {
            const bound = p.scope.bindings[name];

            if (bound) {
              const node = findRootStatementUp(bound.path, boundary);
              if (node && allowed[name] && allowed[name] === bound.path) {
                list[name] = node;

                if (!node.isImportDeclaration()) {
                  node.traverse({
                    Identifier(pi) {
                      if (!list[pi.node.name]) {
                        recurseUp(pi, pi.node.name);
                      }
                    },
                  });
                }
              }
            }

            if (p.parentPath) {
              recurseUp(p.parentPath, name, boundary);
            }
          };

          const visitor: TraverseOptions = {
            ExportNamedDeclaration(p) {
              p.traverse({
                Identifier(pi) {
                  if (!list[pi.node.name]) {
                    recurseUp(pi, pi.node.name, p);
                  }
                },
              });
            },
            Program: {
              enter(p) {
                Object.entries(p.scope.bindings).forEach(([k, v]) => {
                  allowed[k] = v.path;
                });
              },
              exit() {
                Object.entries(list).forEach(([k, v]) => {
                  // console.log(list);
                  const parentProgram = collected.scope.getProgramParent();
                  const id = parentProgram.generateUid(k);

                  v.scope.rename(k, id);

                  // try {
                  //   // collected.scope.getProgramParent().registerDeclaration(v);
                  // } catch (e) {
                  //   //
                  // }

                  scopeAddedNodes.push(v.node as any);
                });
              },
            },
          };
          return {
            visitor,
          };
        },
        function removeTypeAnnotationsPlugin() {
          const visitor: TraverseOptions = {
            TypeAnnotation(p) {
              p.remove();
            },
            TSTypeAnnotation(p) {
              p.remove();
            },
          };
          return {
            visitor,
          };
        },
        'minify-dead-code-elimination',
        'babel-plugin-danger-remove-unused-import',
        'babel-plugin-remove-unused-vars',
        function removeUselessImportsPlugin() {
          const visitor: TraverseOptions = {
            ImportDeclaration(p) {
              const specifiers = p.get('specifiers');

              if (specifiers.length === 0) {
                p.remove();
              }
            },
          };
          return {
            visitor,
          };
        },
        function hoistImportsPlugin() {
          const visitor: TraverseOptions = {
            Program: {
              exit(p) {
                // eslint-disable-next-line no-param-reassign
                p.node.body = p.node.body.sort((a, b) => {
                  return t.isImportDeclaration(a) ? -1 : 0;
                });
              },
            },
          };
          return {
            visitor,
          };
        },
        '@wordpress/babel-plugin-import-jsx-pragma',
      ],
    })
  );

  scopeAddedNodes.filter(onlyUnique).forEach(n => {
    // @ts-ignore
    collected.unshiftContainer('body', n);

    collected.node.body = collected.node.body.sort((a, b) => {
      return t.isImportDeclaration(a) ? -1 : 0;
    });
  });

  return generate(ast, {}, '');
};
