import type * as BabelTypesNamespace from '@babel/types';
import type * as BabelCoreNamespace from '@babel/core';

type BabelTypes = typeof BabelTypesNamespace;
type PrimaryTypes = Record<string, any> | string | number | boolean | undefined | null;

export type JSReturnValue = PrimaryTypes | Array<PrimaryTypes>;

export type VariableMeta = {
  /**
   * Variable Declaration name of the assigned function call
   * @example
   * import { Roboto } from '@next/font/google'
   * const robotoName = Roboto({
   *   weight: '400'
   * })
   *
   * // identifierName = 'robotName'
   */
  identifierName: string;
  /**
   * Properties of the assigned function call
   * @example
   * import { Roboto } from '@next/font/google'
   * const robotoName = Roboto({
   *   weight: '400'
   * })
   *
   * // properties = { weight: '400' }
   */
  properties: JSReturnValue;
  /**
   * Function name of the imported @next/font/google function
   * @example
   * import { Roboto } from '@next/font/google'
   * const robotoName = Roboto({
   *   weight: '400'
   * })
   *
   * // functionName = Roboto
   */
  functionName: string;
};

function convertNodeToJSON(types: BabelTypes, node: any): JSReturnValue {
  if (types.isBooleanLiteral(node) || types.isStringLiteral(node) || types.isNumericLiteral(node)) {
    return node.value;
  }

  if (node.name === 'undefined' && !node.value) {
    return undefined;
  }

  if (types.isNullLiteral(node)) {
    return null;
  }

  if (types.isObjectExpression(node)) {
    return computeProps(types, node.properties);
  }

  if (types.isArrayExpression(node)) {
    return node.elements.reduce(
      (acc, element) => [
        ...acc,
        ...(element?.type === 'SpreadElement'
          ? (convertNodeToJSON(types, element.argument) as PrimaryTypes[])
          : [convertNodeToJSON(types, element)]),
      ],
      [] as PrimaryTypes[]
    );
  }

  return {};
}

function computeProps(
  types: BabelTypes,
  props: (
    | BabelTypesNamespace.ObjectMethod
    | BabelTypesNamespace.ObjectProperty
    | BabelTypesNamespace.SpreadElement
  )[]
) {
  return props.reduce((acc, prop) => {
    if (prop.type === 'SpreadElement') {
      return {
        ...acc,
        ...(convertNodeToJSON(types, prop.argument) as Record<string, any>),
      };
    }
    if (prop.type !== 'ObjectMethod') {
      const val = convertNodeToJSON(types, prop.value);
      if (val !== undefined && types.isIdentifier(prop.key)) {
        return {
          ...acc,
          [prop.key.name]: val,
        };
      }
    }
    return acc;
  }, {});
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

/**
 * Removes transformed variable declarations, which were already replaced with parameterized imports
 * @example
 * // AST
 * import { Roboto, Inter } from '@next/font/google'
 * const interName = Inter({
 *  subsets: ['latin'],
 * })
 * const robotoName = Roboto({
 *   weight: '400'
 * })
 *
 * // Result
 * import { Roboto, Inter } from '@next/font/google'
 *
 * // Variable declarations are removed
 */
export function removeTransformedVariableDeclarations(
  path: BabelCoreNamespace.NodePath<BabelCoreNamespace.types.ImportDeclaration>,
  types: BabelTypes,
  metas: VariableMeta[]
) {
  path.parentPath.traverse({
    VariableDeclarator(declaratorPath) {
      if (!declaratorPath.parentPath.parentPath?.isProgram()) {
        return;
      }

      if (
        metas.some(
          (meta) =>
            types.isIdentifier(declaratorPath.node.id) &&
            meta.identifierName === declaratorPath.node.id.name
        )
      ) {
        declaratorPath.remove();
      }
    },
  });
}

/**
 * Replaces `@next/font` import with a parameterized import
 * @example
 * // AST
 * import { Roboto, Inter } from '@next/font/google'
 * const interName = Inter({
 *  subsets: ['latin'],
 * })
 * const robotoName = Roboto({
 *   weight: '400'
 * })
 *
 * // Result
 * import interName from '@next/font/google?Inter;{"subsets":["latin"]}'
 * import robotoName from '@next/font/google?Roboto;{"weight":"400"}'
 *
 * // Following code will be removed from removeUnusedVariableDeclarations function
 * const interName = Inter({
 *  subsets: ['latin'],
 * })
 *
 * const robotoName = Roboto({
 *   weight: '400'
 * })
 */
export function replaceImportWithParamterImport(
  path: BabelCoreNamespace.NodePath<BabelCoreNamespace.types.ImportDeclaration>,
  types: BabelTypes,
  source: BabelCoreNamespace.types.StringLiteral,
  metas: Array<VariableMeta>
) {
  // Add an import for each specifier with parameters
  path.replaceWithMultiple([
    ...metas.map((meta) => {
      return types.importDeclaration(
        [types.importDefaultSpecifier(types.identifier(meta.identifierName))],
        types.stringLiteral(
          // TODO
          `${source.value}?${meta.functionName};${JSON.stringify(meta.properties).replace(
            '\\"',
            "'"
          )}`
        )
      );
    }),
  ]);
}

/**
 * Get meta information for the provided import specifier
 * @example
 * // AST
 * import { Roboto, Inter } from '@next/font/google'
 * const interName = Inter({
 *  subsets: ['latin'],
 * })
 * const robotoName = Roboto({
 *   weight: '400'
 * })
 *
 * // Return value
 * const variableMetas = [{
 *   identifierName: 'interName',
 *   properties: { subsets: ['latin'] },
 *   functionName: 'Inter'
 * }, {
 *   identifierName: 'robotoName',
 *   properties: { weight: '400' },
 *   functionName: 'Roboto'
 * }]
 */
export function getVariableMetasBySpecifier(
  program: BabelCoreNamespace.NodePath<BabelCoreNamespace.types.Program>,
  types: BabelTypes,
  specifier:
    | BabelCoreNamespace.types.ImportDefaultSpecifier
    | BabelCoreNamespace.types.ImportNamespaceSpecifier
    | BabelCoreNamespace.types.ImportSpecifier
) {
  return program.node.body
    .map((statement) => {
      if (!types.isVariableDeclaration(statement)) {
        return undefined;
      }

      const declaration = statement.declarations[0];

      if (!types.isIdentifier(declaration.id)) {
        return undefined;
      }

      if (!types.isCallExpression(declaration.init)) {
        return undefined;
      }

      if (
        (!types.isIdentifier(declaration.init.callee) ||
          specifier.type !== 'ImportSpecifier' ||
          specifier.imported.type !== 'Identifier' ||
          declaration.init.callee.name !== specifier.imported.name) &&
        (!types.isIdentifier(declaration.init.callee) ||
          specifier.type !== 'ImportDefaultSpecifier' ||
          declaration.init.callee.name !== specifier.local.name)
      ) {
        return undefined;
      }

      const options = declaration.init.arguments[0];

      if (!types.isObjectExpression(options)) {
        throw program.buildCodeFrameError(
          'Please pass an options object to the call expression of @next/font functions'
        );
      }

      options.properties.forEach((property) => {
        if (types.isSpreadElement(property)) {
          throw program.buildCodeFrameError(
            'Please do not use spread elements in the options object in @next/font function calls'
          );
        }
      });

      const identifierName = declaration.id.name;
      const properties = convertNodeToJSON(types, options);
      const functionName = declaration.init.callee.name;

      return { identifierName, properties, functionName };
    })
    .filter(isDefined);
}
