/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as t from '@babel/types';
import { TraverseOptions, NodePath } from '@babel/traverse';
import { transformFileAsync } from '@babel/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DependencyList extends Array<DependencyList | string> {}

interface DependencyGraph {
  [id: string]: DependencyList;
}
interface FlatDependencyGraph {
  [id: string]: string[];
}

type Targets = string[];

const flattenList = (l1: DependencyList): string[] => {
  let started = false;
  const f = (l2: DependencyList): string[] => {
    if (started && l1 === l2) {
      throw new Error('CYCLICAL config is bad');
    }

    started = true;

    return l2.reduce<string[]>((acc, i) => {
      return [...acc, ...(Array.isArray(i) ? f(i) : [i])];
    }, []);
  };

  return f(l1);
};

const unique = (value: unknown, index: number, self: unknown[]) => {
  return self.indexOf(value) === index;
};

const flattenDependencyGraph = (graph: DependencyGraph): FlatDependencyGraph => {
  return Object.entries(graph)
    .map(([k, v]) => {
      v.forEach(vk => {
        if (typeof vk === 'string') {
          const target = graph[k];
          const addition = graph[vk] || [];

          target.push(addition);
        }
      });

      return [k, v] as [string, DependencyList];
    })
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: flattenList(v).filter(unique),
      }),
      {}
    );
};

const getAllowed = (graph: FlatDependencyGraph, targets: Targets) => [
  ...targets,
  ...targets.reduce((acc, target) => [...acc, ...(graph[target] || [])], [] as string[]),
];

const createFilterCollectorPlugin = (targets: string[]) => {
  return function filterCollectorPlugin() {
    const dependencyGraph: DependencyGraph = {};

    const visitor: TraverseOptions = {
      ExportNamedDeclaration(p) {
        const declaration = p.get('declaration') as NodePath<t.Declaration>;
        if (declaration.isVariableDeclaration()) {
          const declarations = declaration.get('declarations');

          declarations.forEach((d: NodePath<t.VariableDeclarator>) => {
            const init = d.get('init');
            const id = d.get('id');

            if (id.isIdentifier() && init.isArrayExpression()) {
              const did = id.node.name;
              const elements = init.get('elements');

              elements.forEach(e => {
                if (e.isFunctionExpression() || e.isArrowFunctionExpression()) {
                  const { params } = e.node;

                  if (params[1] && t.isIdentifier(params[1])) {
                    e.traverse({
                      MemberExpression(mp) {
                        const object = mp.get('object');
                        const property = mp.get('property') as NodePath<t.Identifier>;

                        if (object.isIdentifier() && property.isIdentifier()) {
                          try {
                            const oScope = mp.scope.bindings;
                            // @ts-ignore
                            const gScope = mp.hub.getScope().bindings;
                            const pid = property.node.name;
                            const oid = object.node.name;

                            if (oScope[oid].path.node === params[1] && gScope[pid]) {
                              if (dependencyGraph[did]) {
                                dependencyGraph[did].push(pid);
                              } else {
                                dependencyGraph[did] = [pid];
                              }
                            }
                          } catch (err) {
                            //
                          }
                        }
                      },
                    });
                  }
                }
              });
            }
          });
        }
      },
      Program: {
        exit(p) {
          const graph = flattenDependencyGraph(dependencyGraph);
          const allowed = getAllowed(graph, targets);
          const body = p.get('body');

          body.forEach(b => {
            if (b.isExportNamedDeclaration()) {
              const declaration = b.get('declaration') as NodePath<t.Declaration>;

              if (declaration.isVariableDeclaration()) {
                const { declarations } = declaration.node;

                const name = declarations.reduce((acc, d) => {
                  if (t.isIdentifier(d.id)) {
                    return d.id.name;
                  }
                  return acc;
                }, '');

                if (allowed.includes(name)) {
                  //
                } else {
                  b.remove();
                }
              }
            }
          });
        },
      },
    };
    return {
      visitor,
    };
  };
};
export const filter = async (file: string, config: string[]) =>
  transformFileAsync(file, {
    configFile: false,
    retainLines: true,
    compact: false,
    plugins: [
      '@babel/plugin-syntax-typescript',
      '@babel/plugin-syntax-dynamic-import',
      createFilterCollectorPlugin(config),
      function removeTypeAnnotationsPlugin() {
        const visitor: TraverseOptions = {
          TypeAnnotation(p) {
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
  });
