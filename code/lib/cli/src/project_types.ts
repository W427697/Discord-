/** A list of all frameworks that are supported, but use a package outside the storybook monorepo */
export type ExternalFramework = {
  name: SupportedFrameworks;
  packageName?: string;
  frameworks?: string[];
  renderer?: string;
};

export const externalFrameworks: ExternalFramework[] = [
  { name: 'qwik', packageName: 'storybook-framework-qwik' },
  { name: 'solid', frameworks: ['storybook-solidjs-vite'], renderer: 'storybook-solidjs' },
];

// Should match @storybook/<framework>
export type SupportedFrameworks = 'nextjs' | 'angular' | 'sveltekit' | 'qwik' | 'solid';

// Should match @storybook/<renderer>
export type SupportedRenderers =
  | 'react'
  | 'react-native'
  | 'vue'
  | 'vue3'
  | 'angular'
  | 'ember'
  | 'preact'
  | 'svelte'
  | 'qwik'
  | 'html'
  | 'web-components'
  | 'server'
  | 'solid';

export const SUPPORTED_RENDERERS: SupportedRenderers[] = [
  'react',
  'react-native',
  'vue',
  'vue3',
  'angular',
  'ember',
  'preact',
  'svelte',
  'qwik',
  'solid',
];

export enum ProjectType {
  UNDETECTED = 'UNDETECTED',
  UNSUPPORTED = 'UNSUPPORTED',
  REACT = 'REACT',
  REACT_SCRIPTS = 'REACT_SCRIPTS',
  REACT_NATIVE = 'REACT_NATIVE',
  REACT_PROJECT = 'REACT_PROJECT',
  WEBPACK_REACT = 'WEBPACK_REACT',
  NEXTJS = 'NEXTJS',
  VUE = 'VUE',
  VUE3 = 'VUE3',
  SFC_VUE = 'SFC_VUE',
  ANGULAR = 'ANGULAR',
  EMBER = 'EMBER',
  WEB_COMPONENTS = 'WEB_COMPONENTS',
  HTML = 'HTML',
  QWIK = 'QWIK',
  PREACT = 'PREACT',
  SVELTE = 'SVELTE',
  SVELTEKIT = 'SVELTEKIT',
  SERVER = 'SERVER',
  NX = 'NX',
  SOLID = 'SOLID',
}

export enum CoreBuilder {
  Webpack5 = 'webpack5',
  Vite = 'vite',
}

// The `& {}` bit allows for auto-complete, see: https://github.com/microsoft/TypeScript/issues/29729
export type Builder = CoreBuilder | (string & {});

export enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT_3_8 = 'typescript-3-8',
  TYPESCRIPT_4_9 = 'typescript-4-9',
}

export type TemplateMatcher = {
  files?: boolean[];
  dependencies?: boolean[];
  peerDependencies?: boolean[];
};

export type TemplateConfiguration = {
  preset: ProjectType;
  /** will be checked both against dependencies and devDependencies */
  dependencies?: string[] | { [dependency: string]: (version: string) => boolean };
  peerDependencies?: string[] | { [dependency: string]: (version: string) => boolean };
  files?: string[];
  matcherFunction: (matcher: TemplateMatcher) => boolean;
};

const notInstallableProjectTypes: ProjectType[] = [ProjectType.UNDETECTED, ProjectType.UNSUPPORTED];

export const installableProjectTypes = Object.values(ProjectType)
  .filter((type) => !notInstallableProjectTypes.includes(type))
  .map((type) => type.toLowerCase());
