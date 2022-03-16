import { StorybookConfig, TypescriptOptions } from '@storybook/core-common';

export type EventType =
  | 'start'
  | 'build'
  | 'upgrade'
  | 'init'
  | 'error-build'
  | 'error-dev'
  | 'error-metadata';

export interface Dependency {
  version: string;
}

export interface StorybookAddon extends Dependency {
  options: any;
}

export type StorybookMetadata = {
  anonymousId?: string;
  storybookVersion: string;
  language: 'typescript' | 'javascript';
  framework: {
    name: string;
    options?: any;
  };
  builder?: {
    name: string;
    options: Record<string, any>;
  };
  typescriptOptions?: Partial<TypescriptOptions>;
  addons?: Record<string, StorybookAddon>;
  storybookPackages?: Record<string, Dependency>;
  metaFramework?: {
    name: string;
    packageName: string;
    version: string;
  };
  hasStorybookEslint?: boolean;
  hasStaticDirs?: boolean;
  hasCustomWebpack?: boolean;
  hasCustomBabel?: boolean;
  features?: StorybookConfig['features'];
  refCount?: number;
};

export interface Payload {
  [key: string]: any;
}

export interface Options {
  retryDelay: number;
  immediate: boolean;
  configDir?: string;
}

export interface TelemetryData {
  inCI?: boolean;
  time?: number;
  eventType: EventType;
  payload: Payload;
  metadata?: StorybookMetadata;
}
