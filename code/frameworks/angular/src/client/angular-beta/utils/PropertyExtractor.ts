import { CommonModule } from '@angular/common';
import {
  Component,
  Directive,
  importProvidersFrom,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  Output,
  Pipe,
  Provider,
  ɵReflectionCapabilities as ReflectionCapabilities,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import dedent from 'ts-dedent';
import { NgModuleMetadata } from '../../types';
import { isComponentAlreadyDeclared } from './NgModulesAnalyzer';

export const reflectionCapabilities = new ReflectionCapabilities();
export const REMOVED_MODULES = new InjectionToken('REMOVED_MODULES');
export const uniqueArray = (arr: any[]) => {
  return arr
    .flat(Number.MAX_VALUE)
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index);
};

export class PropertyExtractor implements NgModuleMetadata {
  /* eslint-disable @typescript-eslint/lines-between-class-members */
  declarations?: any[] = [];
  imports?: any[];
  providers?: Provider[];
  singletons?: Array<Provider | ReturnType<typeof importProvidersFrom>>;
  /* eslint-enable @typescript-eslint/lines-between-class-members */

  constructor(private metadata: NgModuleMetadata, private component?: any) {
    this.init();
  }

  // ModuleWithProviders are not a valid import for Standalone components.
  // With the new way of mounting standalone components to the DOM via bootstrapApplication API,
  // we should now pass ModuleWithProviders to the providers array of the bootstrapApplication function.
  static warnImportsModuleWithProviders(propertyExtractor: PropertyExtractor) {
    const hasModuleWithProvidersImport = propertyExtractor.imports.some(
      (importedModule) => 'ngModule' in importedModule
    );

    if (hasModuleWithProvidersImport) {
      // eslint-disable-next-line no-console
      console.warn(
        dedent(
          `
          Storybook Warning: 
          moduleMetadata property 'imports' contains one or more ModuleWithProviders value, likely the result of a 'Module.forRoot()'-style call.
          In Storybook 7.0 we use Angular's new 'bootstrapApplication' API to mount the component to the DOM. 
          The bootstrap function accepts a list of providers that should be available in the application injector, which is where you should pass your ModuleWithProviders.
          To pass ModuleWithProviders to the providers array of the bootstrapApplication function, please use the 'singletons' property instead of the 'imports' in moduleMetadata.
          `
        )
      );
    }
  }

  private init() {
    const analyzed = this.analyzeMetadata(this.metadata);
    this.imports = uniqueArray([CommonModule, analyzed.imports]);
    this.providers = uniqueArray(analyzed.providers);
    this.singletons = uniqueArray(analyzed.singletons);
    this.declarations = uniqueArray(analyzed.declarations);

    if (this.component) {
      const { isDeclarable, isStandalone } = PropertyExtractor.analyzeDecorators(this.component);
      const isDeclared = isComponentAlreadyDeclared(
        this.component,
        analyzed.declarations,
        this.imports
      );

      if (isStandalone) {
        this.imports.push(this.component);
      } else if (isDeclarable && !isDeclared) {
        this.declarations.push(this.component);
      }
    }
  }

  /**
   * Analyze NgModule Metadata
   *
   * - Removes Restricted Imports
   * - Extracts providers from ModuleWithProviders
   * - Flattens imports
   * - Returns a new NgModuleMetadata object
   *
   *
   */
  private analyzeMetadata = (metadata: NgModuleMetadata) => {
    const declarations = [...(metadata?.declarations || [])];
    const providers = [...(metadata?.providers || [])];
    const singletons = [...(metadata?.singletons || [])];
    const imports = [...(metadata?.imports || [])].reduce((acc, imported) => {
      // remove ngModule and use only its providers if it is restricted
      // (e.g. BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, ...etc)
      const [isRestricted, restrictedProviders] = PropertyExtractor.analyzeRestricted(imported);
      if (isRestricted) {
        singletons.unshift(restrictedProviders || []);
        return acc;
      }

      acc.push(imported);

      return acc;
    }, []);

    return { ...metadata, imports, providers, singletons, declarations };
  };

  static analyzeRestricted = (ngModule: NgModule): [boolean] | [boolean, Provider] => {
    /**
     * BrowserModule is restricted,
     * because bootstrapApplication API, which mounts the component to the DOM,
     * automatically imports BrowserModule
     */
    if (ngModule === BrowserModule) {
      return [true];
    }
    /**
     * BrowserAnimationsModule imports BrowserModule, which is restricted,
     * because bootstrapApplication API, which mounts the component to the DOM,
     * automatically imports BrowserModule
     */
    if (ngModule === BrowserAnimationsModule) {
      return [true, provideAnimations()];
    }
    /**
     * NoopAnimationsModule imports BrowserModule, which is restricted,
     * because bootstrapApplication API, which mounts the component to the DOM,
     * automatically imports BrowserModule
     */
    if (ngModule === NoopAnimationsModule) {
      return [true, provideNoopAnimations()];
    }

    return [false];
  };

  static analyzeDecorators = (component: any) => {
    const decorators = reflectionCapabilities.annotations(component);

    const isComponent = decorators.some((d) => this.isDecoratorInstanceOf(d, 'Component'));
    const isDirective = decorators.some((d) => this.isDecoratorInstanceOf(d, 'Directive'));
    const isPipe = decorators.some((d) => this.isDecoratorInstanceOf(d, 'Pipe'));

    const isDeclarable = isComponent || isDirective || isPipe;
    const isStandalone = isComponent && decorators.some((d) => d.standalone);

    return { isDeclarable, isStandalone };
  };

  static isDecoratorInstanceOf = (decorator: any, name: string) => {
    let factory;
    switch (name) {
      case 'Component':
        factory = Component;
        break;
      case 'Directive':
        factory = Directive;
        break;
      case 'Pipe':
        factory = Pipe;
        break;
      case 'Injectable':
        factory = Injectable;
        break;
      case 'Input':
        factory = Input;
        break;
      case 'Output':
        factory = Output;
        break;
      default:
        throw new Error(`Unknown decorator type: ${name}`);
    }
    return decorator instanceof factory || decorator.ngMetadataName === name;
  };
}
