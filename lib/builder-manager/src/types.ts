import type { Builder } from '@storybook/core-common';

import esbuild from 'esbuild';

export interface Stats {
  //
  a?: number;
}

export type WithRequiredProperty<Type, Key extends keyof Type> = Type &
  {
    [Property in Key]-?: Type[Property];
  };

export type ManagerBuilder = Builder<WithRequiredProperty<esbuild.BuildOptions, 'outdir'>, Stats>;
export type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type BuilderStartOptions = Partial<Parameters<ManagerBuilder['start']>['0']>;
export type BuilderStartResult = Unpromise<ReturnType<ManagerBuilder['start']>>;
export type StarterFunction = (
  options: BuilderStartOptions
) => AsyncGenerator<unknown, BuilderStartResult, void>;

export type BuilderBuildOptions = Partial<Parameters<ManagerBuilder['build']>['0']>;
export type BuilderBuildResult = Unpromise<ReturnType<ManagerBuilder['build']>>;
export type BuilderFunction = (
  options: BuilderBuildOptions
) => AsyncGenerator<unknown, BuilderBuildResult, void>;

export type Compilation = esbuild.BuildResult;
