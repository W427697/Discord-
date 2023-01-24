import { CommonModule } from '@angular/common';
import { NgModuleMeta } from '@angular/compiler-cli/src/ngtsc/metadata';
import { NgModule, Provider } from '@angular/core';
import { NgModuleMetadata } from '../../types';
import { isDeclarable, isStandaloneComponent } from './NgComponentAnalyzer';
import { isComponentAlreadyDeclared } from './NgModulesAnalyzer';

/**
 * Flattens Array Deeply
 *
 * - Executes recursively
 *
 * @date `1/24/2023 - 12:58:03 PM`
 * @author `sheriffMoose`
 *
 * @param {any[]} arr - Array to be flattened
 * @returns {*} Array of imports
 */
const flattenArray = (arr: any[]) => {
  return (arr || [])
    .map((item: any): any | any[] => {
      return item instanceof Array ? flattenArray(item) : item;
    })
    .flat();
};

/**
 * Filter Array for Unique Values
 *
 *
 * @date `1/24/2023 - 12:58:03 PM`
 * @author `sheriffMoose`
 *
 * @param {any[]} arr - Array to be flattened
 * @returns {*} Array of imports
 */
const uniqueArray = (arr: any[]) => {
  return flattenArray(arr).filter((value, index, self) => self.indexOf(value) === index);
};

/**
 * Extract Imports from NgModule
 *
 * CommonModule is always imported
 *
 * metadata.imports are flattened deeply and extracted into a new array
 *
 * - If ModuleWithProviders (e.g. forRoot() & forChild() ) is used, the ngModule is extracted without providers.
 *
 * @date `1/24/2023 - 12:58:03 PM`
 * @author `sheriffMoose`
 *
 * @param {NgModuleMetadata} metadata - NG Module Metadata
 * @returns {*} Array of imports
 */
export const extractImports = (metadata: NgModuleMetadata) => {
  const imports = [CommonModule];

  const modules = flattenArray(metadata.imports);
  const withProviders = modules.filter((moduleDef) => !!moduleDef?.ngModule);
  const withoutProviders = modules.filter((moduleDef) => !withProviders.includes(moduleDef));

  return uniqueArray([
    imports,
    withoutProviders,
    withProviders.map((moduleDef) => moduleDef.ngModule),
  ]);
};

/**
 * Extract providers from NgModule
 *
 * - A new array is returned with:
 *   - metadata.providers
 *   - providers from each **ModuleWithProviders** (e.g. forRoot() & forChild() )
 *
 * - Use this in combination with extractImports to get all providers for a specific module
 *
 * @date `1/24/2023 - 12:58:03 PM`
 * @author `sheriffMoose`
 *
 * @param {NgModuleMetadata} metadata - NG Module Metadata
 * @returns {*} Array of providers
 */
export const extractProviders = (metadata: NgModuleMetadata): Provider[] => {
  const providers = (metadata.providers || []) as Provider[];

  const moduleProviders: Provider[] = flattenArray(metadata.imports)
    .filter((moduleDef) => !!moduleDef?.ngModule)
    .map((moduleDef) => moduleDef.providers || []);

  return uniqueArray([].concat(moduleProviders, providers));
};

/**
 * Extract declarations from NgModule
 *
 * - If a story component is provided, it will be added to the declarations array if:
 *    - It is a component or directive or pipe
 *    - It is not already declared
 *    - It is not a standalone component
 *
 * @date `1/24/2023 - 12:58:03 PM`
 * @author `sheriffMoose`
 *
 * @param {NgModuleMetadata} metadata
 * @param {?*} storyComponent
 * @returns {*} Array of declarations
 */
export const extractDeclarations = (metadata: NgModuleMetadata, storyComponent?: any) => {
  const declarations = metadata.declarations || [];
  if (storyComponent) {
    const isStandalone = isStandaloneComponent(storyComponent);
    const isDeclared = isComponentAlreadyDeclared(storyComponent, declarations, metadata.imports);

    const requiresDeclaration = isDeclarable(storyComponent) && !isDeclared && !isStandalone;

    if (requiresDeclaration) {
      declarations.push(storyComponent);
    }
  }
  return uniqueArray(declarations);
};
