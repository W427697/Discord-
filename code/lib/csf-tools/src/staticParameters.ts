import type { Parameters } from '@storybook/csf';
import * as generate from '@babel/generator';
import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

/**
 * Resolve an imported value from another module.
 */
type Resolver = (exportName: string, basePath: string, importPath: string) => unknown;

export interface StaticParametersOptions {
  parameterList: string[];
  resolver: Resolver;
}

/**
 * Convert a POJO into a Babel AST. Adapted from:
 *
 * https://github.com/ccpu/babel-object-to-ast/blob/master/src/index.ts
 */
function astify(literal: any): t.Expression {
  if (literal === null) {
    return t.nullLiteral();
  }
  switch (typeof literal) {
    case 'function':
      throw new Error('cannot astify function');
    case 'number':
      return t.numericLiteral(literal);
    case 'string':
      return t.stringLiteral(literal);
    case 'boolean':
      return t.booleanLiteral(literal);
    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true);
    default:
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(astify));
      }
      return t.objectExpression(
        Object.keys(literal)
          .filter((k) => {
            return typeof literal[k] !== 'undefined';
          })
          .map((k) => {
            return t.objectProperty(t.stringLiteral(k), astify(literal[k]));
          })
      );
  }
}

/**
 * Resolve a variable referendce, either in the local file
 * scope, or using the resolver if it's coming from a module import.
 */
function resolveOne(
  path: NodePath<t.Expression>,
  basePath: string,
  resolver: Resolver
): t.Expression {
  if (!path.isIdentifier()) throw new Error(`Unknown path type ${path.type}`);

  const target = path.scope.bindings[path.node.name].path;
  if (target.isImportSpecifier()) {
    const imported = target.get('imported');
    if (imported.isIdentifier()) {
      const decl = target.parentPath as NodePath<t.ImportDeclaration>;
      return astify(resolver(imported.node.name, basePath, decl.node.source.value));
    }
  } else if (target.isImportDefaultSpecifier()) {
    const decl = target.parentPath as NodePath<t.ImportDeclaration>;
    return astify(resolver('default', basePath, decl.node.source.value));
  } else if (target.isVariableDeclarator()) {
    return target.get('init').node as t.Expression;
  }
  return target.node as t.Expression;
}

interface Replacement {
  parent: any;
  field: string;
  replace: t.Expression;
}

/**
 * Traverse the tree and resolve all variable references.
 * Mutate the AST in place.
 */
function resolveAll(path: NodePath, basePath: string, resolver: Resolver) {
  const replacements: Replacement[] = [];

  path.traverse({
    Identifier(id) {
      const parent = id.parentPath;
      if (parent.isObjectProperty() && parent.get('value') === id) {
        replacements.push({
          parent: parent.node,
          field: 'value',
          replace: resolveOne(id, basePath, resolver),
        });
      } else if (parent.isMemberExpression() && parent.get('object') === id) {
        replacements.push({
          parent: parent.node,
          field: 'object',
          replace: resolveOne(id, basePath, resolver),
        });
      }
    },
  });
  replacements.forEach(({ parent, field, replace }) => {
    // eslint-disable-next-line no-param-reassign
    parent[field] = replace;
  });

  return path;
}

/**
 * Evaluate a parameter AST node and return the value.
 */
function evalParameter(path: NodePath, basePath: string, resolver: Resolver) {
  if (path) {
    const resolved = resolveAll(path, basePath, resolver);
    const { code } = generate.default(resolved.node, {});

    // eslint-disable-next-line no-eval
    const value = (0, eval)(`(() => (${code}))()`);
    return value;
  }
  throw new Error('undefined parameter');
}

/**
 * Parse a specified set of parameters out of a parameters object.
 */
export function parseStaticParameters(
  parameters: NodePath,
  basePath: string,
  options: StaticParametersOptions
): Parameters | undefined {
  // console.log('parseStaticParameters', path.node, options.parameterList);

  let target: NodePath = parameters;
  if (target.isIdentifier()) {
    const binding = target.scope.bindings[target.node.name].path;
    if (binding.isVariableDeclarator()) {
      target = binding.get('init') as NodePath;
    }
  }

  if (target.isObjectExpression()) {
    return target.get('properties').reduce((acc, prop) => {
      if (prop.isSpreadElement()) {
        const arg = prop.get('argument');
        if (arg.isIdentifier()) {
          const binding = target.scope.bindings[arg.node.name].path;
          if (binding.isVariableDeclarator()) {
            const init = binding.get('init');
            if (init.isObjectExpression()) {
              return { ...acc, ...parseStaticParameters(init, basePath, options) };
            }
          }
        }
        if (arg.isObjectExpression()) {
          return { ...acc, ...parseStaticParameters(arg, basePath, options) };
        }
        throw new Error('spread argument must be an identifier or an object expression');
      }

      if (prop.isObjectProperty()) {
        const key = prop.get('key');
        if (key.isIdentifier()) {
          const { name } = key.node;
          if (options.parameterList.includes(name)) {
            try {
              let value: NodePath = prop.get('value');
              if (value.isIdentifier()) {
                const binding = value.scope.bindings[value.node.name]?.path;
                if (binding?.isVariableDeclarator()) {
                  value = binding.get('init') as NodePath;
                }
              }
              acc[name] = evalParameter(value, basePath, options.resolver);
            } catch (err) {
              acc[name] = err;
            }
          }
        }
      }
      return acc;
    }, {} as Parameters);
  }
  return undefined;
}

/**
 * FIXME: reuse the existing `combineParameters` code
 */
export const combineParameters = (...parameterSets: (Parameters | undefined)[]) => {
  const definedParametersSets = parameterSets.filter(Boolean) as Parameters[];
  if (definedParametersSets.length === 0) {
    return undefined;
  }
  if (definedParametersSets.length === 1) {
    return definedParametersSets[0];
  }
  return definedParametersSets.reduce((acc, parameters) => {
    Object.entries(parameters).forEach(([key, value]) => {
      const existing = acc[key];
      if (Array.isArray(value) || typeof existing === 'undefined') {
        acc[key] = value;
      } else if (typeof value !== 'undefined') {
        acc[key] = value;
      }
    });
    return acc;
  }, {} as Parameters);
};
