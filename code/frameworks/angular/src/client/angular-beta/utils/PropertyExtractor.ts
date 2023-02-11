import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import {
  Component,
  Directive,
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
  singletons?: Provider[];
  dependencies?: Provider[];
  /* eslint-enable @typescript-eslint/lines-between-class-members */

  constructor(private metadata: NgModuleMetadata, private component?: any) {
    this.init();
  }

  private init() {
    const analyzed = this.analyzeMetadata(this.metadata);
    this.imports = uniqueArray([CommonModule, analyzed.imports]);
    this.providers = uniqueArray(analyzed.providers);
    this.singletons = uniqueArray(analyzed.singletons);
    this.declarations = uniqueArray(analyzed.declarations);

    if (this.component) {
      const { isStandalone, isDeclarable } = PropertyExtractor.analyzeDecorators(this.component);
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

    this.dependencies = uniqueArray(
      this.declarations.map((dec) => {
        const params = dec?.ctorParameters;
        if (params) {
          return params().map((p: any) => p?.type);
        }
        return null;
      })
    );
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
    const singletons: any[] = [...(metadata?.singletons || [])];
    const dependencies: any[] = [...(metadata?.dependencies || [])];
    const imports = [...(metadata?.imports || [])].reduce((acc, imported) => {
      // remove ngModule and use only its providers if it is restricted
      // (e.g. BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, ...etc)
      const [isRestricted, restrictedProviders] = PropertyExtractor.analyzeRestricted(imported);
      if (isRestricted) {
        singletons.unshift(restrictedProviders || []);
        return acc;
      }

      // destructure into ngModule & providers if it is a ModuleWithProviders
      if (imported?.providers) {
        providers.unshift(imported.providers || []);
        // eslint-disable-next-line no-param-reassign
        imported = imported.ngModule;
      }

      // extract providers, declarations, singletons from ngModule
      // eslint-disable-next-line no-underscore-dangle
      const ngMetadata = imported?.__annotations__?.[0];
      if (ngMetadata) {
        const newMetadata = this.analyzeMetadata(ngMetadata);
        acc.unshift(...newMetadata.imports);
        providers.unshift(...newMetadata.providers);
        singletons.unshift(...newMetadata.singletons);
        dependencies.unshift(...newMetadata.dependencies);
        declarations.unshift(...newMetadata.declarations);

        if (ngMetadata.standalone === true) {
          acc.push(imported);
        }
        // keeping a copy of the removed module
        providers.push({ provide: REMOVED_MODULES, useValue: imported, multi: true });
        return acc;
      }

      // include Angular official modules as-is
      if (imported.ɵmod) {
        acc.push(imported);
        return acc;
      }

      return acc;
    }, []);

    return { ...metadata, imports, providers, singletons, dependencies, declarations };
  };

  static analyzeRestricted = (ngModule: NgModule) => {
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

    /**
     * HttpClient has to be provided manually as a singleton
     */
    if (ngModule === HttpClientModule) {
      return [true, provideHttpClient()];
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

    return { isComponent, isDirective, isPipe, isDeclarable, isStandalone };
  };

  static getDecoratorByType = (component: any, type: string) => {
    const decorators = reflectionCapabilities.annotations(component);
    return decorators.find((d) => this.isDecoratorInstanceOf(d, type));
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
