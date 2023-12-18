/* eslint-disable no-underscore-dangle */
import fs from 'fs-extra';
import { dedent } from 'ts-dedent';

import * as t from '@babel/types';

import * as generate from '@babel/generator';
import * as recast from 'recast';

import type { NodePath } from '@babel/traverse';
import traverse from '@babel/traverse';
import { toId, isExportStory, storyNameFromExport } from '@storybook/csf';
import type {
  Tag,
  StoryAnnotations,
  ComponentAnnotations,
  IndexedCSFFile,
  IndexInput,
} from '@storybook/types';
import type { Options } from 'recast';
import { babelParse } from './babelParse';
import { findVarInitialization } from './findVarInitialization';
import { parseStaticParameters, combineParameters } from './staticParameters';
import type { StaticParametersOptions, StaticParameters } from './staticParameters';

export type { StaticParameters };

const logger = console;

function parseIncludeExclude(prop: t.Node) {
  if (t.isArrayExpression(prop)) {
    return prop.elements.map((e) => {
      if (t.isStringLiteral(e)) return e.value;
      throw new Error(`Expected string literal: ${e}`);
    });
  }

  if (t.isStringLiteral(prop)) return new RegExp(prop.value);

  if (t.isRegExpLiteral(prop)) return new RegExp(prop.pattern, prop.flags);

  throw new Error(`Unknown include/exclude: ${prop}`);
}

function parseTags(prop: t.Node) {
  if (!t.isArrayExpression(prop)) {
    throw new Error('CSF: Expected tags array');
  }

  return prop.elements.map((e) => {
    if (t.isStringLiteral(e)) return e.value;
    throw new Error(`CSF: Expected tag to be string literal`);
  }) as Tag[];
}

const formatLocation = (node: t.Node, fileName?: string) => {
  const { line, column } = node.loc?.start || {};
  return `${fileName || ''} (line ${line}, col ${column})`.trim();
};

const isArgsStory = (init: t.Node, parent: t.Node, csf: CsfFile) => {
  let storyFn: t.Node = init;
  // export const Foo = Bar.bind({})
  if (t.isCallExpression(init)) {
    const { callee, arguments: bindArguments } = init;
    if (
      t.isProgram(parent) &&
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.object) &&
      t.isIdentifier(callee.property) &&
      callee.property.name === 'bind' &&
      (bindArguments.length === 0 ||
        (bindArguments.length === 1 &&
          t.isObjectExpression(bindArguments[0]) &&
          bindArguments[0].properties.length === 0))
    ) {
      const boundIdentifier = callee.object.name;
      const template = findVarInitialization(boundIdentifier, parent);
      if (template) {
        // eslint-disable-next-line no-param-reassign
        csf._templates[boundIdentifier] = template;
        storyFn = template;
      }
    }
  }
  if (t.isArrowFunctionExpression(storyFn)) {
    return storyFn.params.length > 0;
  }
  if (t.isFunctionDeclaration(storyFn)) {
    return storyFn.params.length > 0;
  }
  return false;
};

const parseExportsOrder = (init: t.Expression) => {
  if (t.isArrayExpression(init)) {
    return (init.elements as t.Expression[]).map((item) => {
      if (t.isStringLiteral(item)) {
        return item.value;
      }
      throw new Error(`Expected string literal named export: ${item}`);
    });
  }
  throw new Error(`Expected array of string literals: ${init}`);
};

const sortExports = (exportByName: Record<string, any>, order: string[]) => {
  return order.reduce((acc, name) => {
    const namedExport = exportByName[name];
    if (namedExport) acc[name] = namedExport;
    return acc;
  }, {} as Record<string, any>);
};

export interface CsfOptions {
  fileName?: string;
  makeTitle: (userTitle: string) => string;
  staticParametersOptions?: StaticParametersOptions;
}

export class NoMetaError extends Error {
  constructor(message: string, ast: t.Node, fileName?: string) {
    super(dedent`
      CSF: ${message} ${formatLocation(ast, fileName)}

      More info: https://storybook.js.org/docs/react/writing-stories#default-export
    `);
    this.name = this.constructor.name;
  }
}

export interface StaticMeta
  extends Pick<
    ComponentAnnotations,
    'id' | 'title' | 'includeStories' | 'excludeStories' | 'tags'
  > {
  component?: string;
  staticParameters?: StaticParameters;
}

export interface StaticStory extends Pick<StoryAnnotations, 'name' | 'parameters' | 'tags'> {
  id: string;
  staticParameters?: StaticParameters;
}

export class CsfFile {
  _ast: t.File;

  _fileName: string;

  _makeTitle: (title: string) => string;

  _staticParametersOptions?: StaticParametersOptions;

  _meta?: StaticMeta;

  _stories: Record<string, StaticStory> = {};

  _metaAnnotations: Record<string, t.Node> = {};

  _storyExports: Record<string, t.VariableDeclarator | t.FunctionDeclaration> = {};

  _metaStatement: t.Statement | undefined;

  _metaNode: t.Expression | undefined;

  _storyStatements: Record<string, t.ExportNamedDeclaration> = {};

  _storyAnnotations: Record<string, Record<string, t.Node>> = {};

  _templates: Record<string, t.Expression> = {};

  _namedExportsOrder?: string[];

  imports: string[];

  constructor(ast: t.File, { fileName, makeTitle, staticParametersOptions }: CsfOptions) {
    this._ast = ast;
    this._fileName = fileName as string;
    this.imports = [];
    this._makeTitle = makeTitle;
    this._staticParametersOptions = staticParametersOptions;
  }

  _parseTitle(value: t.Node) {
    const node = t.isIdentifier(value)
      ? findVarInitialization(value.name, this._ast.program)
      : value;
    if (t.isStringLiteral(node)) {
      return node.value;
    }
    if (t.isTSSatisfiesExpression(node) && t.isStringLiteral(node.expression)) {
      return node.expression.value;
    }

    throw new Error(dedent`
      CSF: unexpected dynamic title ${formatLocation(node, this._fileName)}

      More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#string-literal-titles
    `);
  }

  _parseMeta(declaration: NodePath<t.ObjectExpression>) {
    const meta: StaticMeta = {};
    declaration.get('properties').forEach((p) => {
      if (p.isObjectProperty()) {
        const key = p.get('key');
        const value = p.get('value');
        if (key.isIdentifier()) {
          const { name } = key.node;
          this._metaAnnotations[name] = value.node;
          if (name === 'title') {
            meta.title = this._parseTitle(value.node);
          } else if (['includeStories', 'excludeStories'].includes(name)) {
            (meta as any)[name] = parseIncludeExclude(value.node);
          } else if (name === 'component') {
            const { code } = recast.print(value.node, {});
            meta.component = code;
          } else if (name === 'tags') {
            let tags: NodePath = value;
            if (tags.isIdentifier()) {
              tags = tags.scope.bindings[tags.node.name].path.get('init') as NodePath;
            }
            meta.tags = parseTags(tags.node);
          } else if (name === 'id') {
            if (value.isStringLiteral()) {
              meta.id = value.node.value;
            } else {
              throw new Error(`Unexpected component id: ${value.node}`);
            }
          } else if (name === 'parameters' && this._staticParametersOptions) {
            meta.staticParameters = parseStaticParameters(
              value,
              this._fileName,
              this._staticParametersOptions
            );
          }
        }
      }
    });
    this._meta = meta;
  }

  getStoryExport(key: string) {
    let node = this._storyExports[key] as t.Node;
    node = t.isVariableDeclarator(node) ? (node.init as t.Node) : node;
    if (t.isCallExpression(node)) {
      const { callee, arguments: bindArguments } = node;
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'bind' &&
        (bindArguments.length === 0 ||
          (bindArguments.length === 1 &&
            t.isObjectExpression(bindArguments[0]) &&
            bindArguments[0].properties.length === 0))
      ) {
        const { name } = callee.object;
        node = this._templates[name];
      }
    }
    return node;
  }

  parse() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    traverse(this._ast, {
      ExportDefaultDeclaration: {
        enter(path) {
          let metaPath: NodePath | undefined;
          let decl: NodePath = path.get('declaration');
          // const meta = { ... };
          // export default meta;
          if (decl.isIdentifier()) {
            decl = path.scope.bindings[decl.node.name].path.get('init') as NodePath;
            const parentStatement = decl.findParent((p) => p.isStatement())?.node as t.Statement;
            if (parentStatement) self._metaStatement = parentStatement;
          } else {
            self._metaStatement = path.node;
          }

          if (decl.isObjectExpression()) {
            // export default { ... };
            metaPath = decl;
          } else if (
            // export default { ... } as Meta<...>
            decl.isTSAsExpression() ||
            decl.isTSSatisfiesExpression()
          ) {
            const expr = decl.get('expression') as NodePath;
            if (expr.isObjectExpression()) {
              metaPath = expr;
            }
          } else {
            metaPath = undefined;
          }

          if (!self._meta && metaPath) {
            self._metaNode = metaPath.node as t.Expression;
            self._parseMeta(metaPath as NodePath<t.ObjectExpression>);
          }

          if (self._metaStatement && !self._metaNode) {
            throw new NoMetaError(
              'default export must be an object',
              self._metaStatement,
              self._fileName
            );
          }
        },
      },
      ExportNamedDeclaration: {
        enter(path) {
          let declarations;
          const declaration = path.get('declaration');
          if (declaration.isVariableDeclaration()) {
            declarations = declaration.get('declarations').filter((d) => d.isVariableDeclarator());
          } else if (declaration.isFunctionDeclaration()) {
            declarations = [declaration];
          }
          const specifiers = path.get('specifiers');
          if (declarations) {
            // export const X = ...;
            declarations.forEach((decl: NodePath<t.VariableDeclarator | t.FunctionDeclaration>) => {
              const id = decl.get('id');
              const init = decl.get('init') as NodePath;
              if (id.isIdentifier()) {
                const { name: exportName } = id.node;
                if (exportName === '__namedExportsOrder' && decl.isVariableDeclarator()) {
                  self._namedExportsOrder = parseExportsOrder(init.node as t.Expression);
                  return;
                }
                self._storyExports[exportName] = decl.node;
                self._storyStatements[exportName] = path.node;
                let storyName = storyNameFromExport(exportName);
                if (self._storyAnnotations[exportName]) {
                  logger.warn(
                    `Unexpected annotations for "${exportName}" before story declaration`
                  );
                } else {
                  self._storyAnnotations[exportName] = {};
                }
                let storyPath;
                if (decl.isVariableDeclarator()) {
                  storyPath =
                    init.isTSAsExpression() || init.isTSSatisfiesExpression()
                      ? (init.get('expression') as NodePath)
                      : init;
                } else {
                  storyPath = decl;
                }
                let staticParameters: StaticParameters | undefined;
                const parameters: { [key: string]: any } = {};
                if (storyPath.isObjectExpression()) {
                  parameters.__isArgsStory = true; // assume default render is an args story
                  // CSF3 object export
                  const properties = storyPath.get('properties');
                  properties.forEach((p) => {
                    const key = p.get('key') as NodePath;
                    const value = p.get('value') as NodePath;
                    if (key.isIdentifier()) {
                      const { name } = key.node;
                      if (name === 'render') {
                        parameters.__isArgsStory = isArgsStory(
                          value.node as t.Expression,
                          path.parent,
                          self
                        );
                      } else if (name === 'name' && value.isStringLiteral()) {
                        storyName = value.node.value;
                      } else if (name === 'storyName' && value.isStringLiteral()) {
                        logger.warn(
                          `Unexpected usage of "storyName" in "${exportName}". Please use "name" instead.`
                        );
                      } else if (name === 'parameters' && value.isObjectExpression()) {
                        const idProperty = value.node.properties.find(
                          (property) =>
                            t.isObjectProperty(property) &&
                            t.isIdentifier(property.key) &&
                            property.key.name === '__id'
                        ) as t.ObjectProperty | undefined;
                        if (idProperty) {
                          parameters.__id = (idProperty.value as t.StringLiteral).value;
                        }
                        if (self._staticParametersOptions) {
                          staticParameters = parseStaticParameters(
                            value,
                            self._fileName,
                            self._staticParametersOptions
                          );
                        }
                      }

                      self._storyAnnotations[exportName][name] = value.node;
                    }
                  });
                } else {
                  parameters.__isArgsStory = isArgsStory(
                    storyPath.node as t.Node,
                    path.parent,
                    self
                  );
                }
                self._stories[exportName] = {
                  id: 'FIXME',
                  name: storyName,
                  parameters,
                  staticParameters,
                };
              }
            });
          } else if (specifiers.length > 0) {
            // export { X as Y }
            specifiers.forEach((specifier: NodePath) => {
              if (specifier.isExportSpecifier()) {
                const exported = specifier.get('exported');
                const local = specifier.get('local');
                if (exported.isIdentifier()) {
                  const { name: exportName } = exported.node;
                  if (exportName === 'default') {
                    let metaPath: NodePath<t.ObjectExpression> | undefined;
                    const decl = local.scope.bindings[local.node.name].path;
                    const init = decl?.get('init') as NodePath;
                    if (init.isObjectExpression()) {
                      // export default { ... };
                      metaPath = init;
                    } else if (init.isTSAsExpression()) {
                      // export default { ... } as Meta<...>
                      const expr = init.get('expression');
                      if (expr.isObjectExpression()) {
                        metaPath = expr;
                      }
                    } else {
                      metaPath = undefined;
                    }

                    if (!self._meta && metaPath) {
                      self._parseMeta(metaPath);
                    }
                  } else {
                    self._storyAnnotations[exportName] = {};
                    self._stories[exportName] = { id: 'FIXME', name: exportName, parameters: {} };
                  }
                }
              }
            });
          }
        },
      },
      ExpressionStatement: {
        enter({ node, parent }) {
          const { expression } = node;
          // B.storyName = 'some string';
          if (
            t.isProgram(parent) &&
            t.isAssignmentExpression(expression) &&
            t.isMemberExpression(expression.left) &&
            t.isIdentifier(expression.left.object) &&
            t.isIdentifier(expression.left.property)
          ) {
            const exportName = expression.left.object.name;
            const annotationKey = expression.left.property.name;
            const annotationValue = expression.right;

            // v1-style annotation
            // A.story = { parameters: ..., decorators: ... }

            if (self._storyAnnotations[exportName]) {
              if (annotationKey === 'story' && t.isObjectExpression(annotationValue)) {
                (annotationValue.properties as t.ObjectProperty[]).forEach((prop) => {
                  if (t.isIdentifier(prop.key)) {
                    self._storyAnnotations[exportName][prop.key.name] = prop.value;
                  }
                });
              } else {
                self._storyAnnotations[exportName][annotationKey] = annotationValue;
              }
            }

            if (annotationKey === 'storyName' && t.isStringLiteral(annotationValue)) {
              const storyName = annotationValue.value;
              const story = self._stories[exportName];
              if (!story) return;
              story.name = storyName;
            }
          }
        },
      },
      CallExpression: {
        enter({ node }) {
          const { callee } = node;
          if (t.isIdentifier(callee) && callee.name === 'storiesOf') {
            throw new Error(dedent`
              Unexpected \`storiesOf\` usage: ${formatLocation(node, self._fileName)}.

              In SB7, we use the next-generation \`storyStoreV7\` by default, which does not support \`storiesOf\`. 
              More info, with details about how to opt-out here: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#storystorev7-enabled-by-default
            `);
          }
        },
      },
      ImportDeclaration: {
        enter({ node }) {
          const { source } = node;
          if (t.isStringLiteral(source)) {
            self.imports.push(source.value);
          } else {
            throw new Error('CSF: unexpected import source');
          }
        },
      },
    });

    if (!self._meta) {
      throw new NoMetaError('missing default export', self._ast, self._fileName);
    }

    if (!self._meta.title && !self._meta.component) {
      throw new Error(dedent`
        CSF: missing title/component ${formatLocation(self._ast, self._fileName)}

        More info: https://storybook.js.org/docs/react/writing-stories#default-export
      `);
    }

    // default export can come at any point in the file, so we do this post processing last
    const entries = Object.entries(self._stories);
    self._meta.title = this._makeTitle(self._meta?.title as string);
    if (self._metaAnnotations.play) {
      self._meta.tags = [...(self._meta.tags || []), 'play-fn'];
    }
    self._stories = entries.reduce((acc, [key, story]) => {
      if (!isExportStory(key, self._meta as StaticMeta)) {
        return acc;
      }
      const id =
        story.parameters?.__id ??
        toId((self._meta?.id || self._meta?.title) as string, storyNameFromExport(key));
      const parameters: Record<string, any> = { ...story.parameters, __id: id };

      const { includeStories } = self._meta || {};
      if (
        key === '__page' &&
        (entries.length === 1 || (Array.isArray(includeStories) && includeStories.length === 1))
      ) {
        parameters.docsOnly = true;
      }
      acc[key] = { ...story, id, parameters };
      const { tags, play } = self._storyAnnotations[key];
      if (tags) {
        const node = t.isIdentifier(tags)
          ? findVarInitialization(tags.name, this._ast.program)
          : tags;
        acc[key].tags = parseTags(node);
      }
      if (play) {
        acc[key].tags = [...(acc[key].tags || []), 'play-fn'];
      }
      return acc;
    }, {} as Record<string, StaticStory>);

    Object.keys(self._storyExports).forEach((key) => {
      if (!isExportStory(key, self._meta as StaticMeta)) {
        delete self._storyExports[key];
        delete self._storyAnnotations[key];
      }
    });

    if (self._namedExportsOrder) {
      const unsortedExports = Object.keys(self._storyExports);
      self._storyExports = sortExports(self._storyExports, self._namedExportsOrder);
      self._stories = sortExports(self._stories, self._namedExportsOrder);

      const sortedExports = Object.keys(self._storyExports);
      if (unsortedExports.length !== sortedExports.length) {
        throw new Error(
          `Missing exports after sort: ${unsortedExports.filter(
            (key) => !sortedExports.includes(key)
          )}`
        );
      }
    }

    return self as CsfFile & IndexedCSFFile;
  }

  public get meta() {
    const { staticParameters, ...rest } = this._meta || {};
    return rest;
  }

  public get stories() {
    const metaParameters = this._meta?.staticParameters;
    return Object.values(this._stories).map((story) => {
      const { staticParameters, ...rest } = story;
      if (this._staticParametersOptions) {
        const parameters = combineParameters(metaParameters, story.staticParameters);
        return {
          ...rest,
          parameters,
        };
      }
      return rest;
    });
  }

  public get indexInputs(): IndexInput[] {
    if (!this._fileName) {
      throw new Error(
        dedent`Cannot automatically create index inputs with CsfFile.indexInputs because the CsfFile instance was created without a the fileName option.
        Either add the fileName option when creating the CsfFile instance, or create the index inputs manually.`
      );
    }
    const metaParameters = this._meta?.staticParameters;
    return Object.entries(this._stories).map(([exportName, story]) => {
      // combine meta and story tags, removing any duplicates
      const tags = Array.from(new Set([...(this._meta?.tags ?? []), ...(story.tags ?? [])]));
      let parameters;
      if (this._staticParametersOptions) {
        parameters = combineParameters(metaParameters, story.staticParameters);
      }
      return {
        type: 'story',
        importPath: this._fileName,
        exportName,
        name: story.name,
        title: this.meta?.title,
        metaId: this.meta?.id,
        tags,
        parameters,
        __id: story.id,
      };
    });
  }
}

export const loadCsf = (code: string, options: CsfOptions) => {
  const ast = babelParse(code);
  return new CsfFile(ast, options);
};

interface FormatOptions {
  sourceMaps?: boolean;
  preserveStyle?: boolean;
}

export const formatCsf = (csf: CsfFile, options: FormatOptions = { sourceMaps: false }) => {
  const result = generate.default(csf._ast, options);
  if (options.sourceMaps) {
    return result;
  }
  const { code } = result;
  return code;
};

/**
 * Use this function, if you want to preserve styles. Uses recast under the hood.
 */
export const printCsf = (csf: CsfFile, options: Options = {}) => {
  return recast.print(csf._ast, options);
};

export const readCsf = async (fileName: string, options: CsfOptions) => {
  const code = (await fs.readFile(fileName, 'utf-8')).toString();
  return loadCsf(code, { ...options, fileName });
};

export const writeCsf = async (csf: CsfFile, fileName?: string) => {
  const fname = fileName || csf._fileName;
  if (!fname) throw new Error('Please specify a fileName for writeCsf');
  await fs.writeFile(fileName as string, printCsf(csf).code);
};
