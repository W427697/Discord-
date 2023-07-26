import { minVersion, validRange } from 'semver';
import type { TemplateConfiguration } from './project_types';
import { ProjectType } from './project_types';

function ltMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major < major;
}

function gtMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major > major;
}

function eqMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major === major;
}

/**
 * Configuration to match a storybook preset template.
 *
 * This has to be an array sorted in order of specificity/priority.
 * Reason: both REACT and WEBPACK_REACT have react as dependency,
 * therefore WEBPACK_REACT has to come first, as it's more specific.
 */
export const supportedTemplates: TemplateConfiguration[] = [
  {
    preset: ProjectType.SFC_VUE,
    dependencies: {
      'vue-loader': (versionRange) => ltMajor(versionRange, 16),
      vuetify: (versionRange) => ltMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.VUE,
    // This Vue template only works with Vue or Nuxt under v3
    dependencies: {
      vue: (versionRange) => ltMajor(versionRange, 3),
      nuxt: (versionRange) => ltMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.VUE3,
    dependencies: {
      // This Vue template works with Vue 3
      vue: (versionRange) => versionRange === 'next' || eqMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.EMBER,
    dependencies: ['ember-cli'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.NEXTJS,
    dependencies: {
      next: (versionRange) => eqMajor(versionRange, 9) || gtMajor(versionRange, 9),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.QWIK,
    dependencies: ['@builder.io/qwik'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_PROJECT,
    peerDependencies: ['react'],
    matcherFunction: ({ peerDependencies }) => {
      return peerDependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_NATIVE,
    dependencies: ['react-native', 'react-native-scripts'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_SCRIPTS,
    // For projects using a custom/forked `react-scripts` package.
    files: ['/node_modules/.bin/react-scripts'],
    // For standard CRA projects
    dependencies: ['react-scripts'],
    matcherFunction: ({ dependencies, files }) => {
      return dependencies.every(Boolean) || files.every(Boolean);
    },
  },
  {
    preset: ProjectType.ANGULAR,
    dependencies: ['@angular/core'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.WEB_COMPONENTS,
    dependencies: ['lit-element', 'lit-html', 'lit'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.PREACT,
    dependencies: ['preact'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    // TODO: This only works because it is before the SVELTE template. could be more explicit
    preset: ProjectType.SVELTEKIT,
    dependencies: ['@sveltejs/kit'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.SVELTE,
    dependencies: ['svelte'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.SOLID,
    dependencies: ['solid-js'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  // DO NOT MOVE ANY TEMPLATES BELOW THIS LINE
  // React is part of every Template, after Storybook is initialized once
  {
    preset: ProjectType.WEBPACK_REACT,
    dependencies: ['react', 'webpack'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT,
    dependencies: ['react'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
];

// A TemplateConfiguration that matches unsupported frameworks
// Framework matchers can be added to this object to give
// users an "Unsupported framework" message
export const unsupportedTemplate: TemplateConfiguration = {
  preset: ProjectType.UNSUPPORTED,
  dependencies: {
    // TODO(blaine): Remove when we support Nuxt 3
    nuxt: (versionRange) => eqMajor(versionRange, 3),
  },
  matcherFunction: ({ dependencies }) => {
    return dependencies.some(Boolean);
  },
};
