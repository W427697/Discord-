import type { StorybookConfig } from '@storybook/types';
import { ProjectType } from './project_types';

export type SkippableTask =
  | 'smoke-test'
  | 'test-runner'
  | 'test-runner-dev'
  | 'chromatic'
  | 'e2e-tests'
  | 'e2e-tests-dev'
  | 'bench';

export type TemplateKey =
  | keyof typeof baseTemplates
  | keyof typeof internalTemplates
  | keyof typeof benchTemplates
  | keyof typeof yarnTemplates
  | keyof typeof pnpmTemplates;
export type Cadence = keyof typeof templatesByCadence;

export type Template = {
  /**
   * Readable name for the template, which will be used for feedback and the status page
   */
  name: `${string} (${'Webpack5' | 'Vite'} | ${'JavaScript' | 'TypeScript'} | ${
    | 'npm'
    | 'pnpm'
    | 'yarn'}${string})`;
  /**
   * Script used to generate the base project of a template.
   * The Storybook CLI will then initialize Storybook on top of that template.
   * This is used to generate projects which are pushed to https://github.com/storybookjs/sandboxes
   */
  script: string;
  /**
   * Used to assert various things about the generated template.
   * If the template is generated with a different expected framework, it will fail, detecting a possible regression.
   */
  expected: {
    framework: string;
    renderer: string;
    builder: string;
  };

  expectedFailures?: Array<{
    feature: string;
    issues: string[];
  }>;

  unsupportedFeatures?: Array<{
    feature: string;
    issues: string[];
  }>;
  /**
   * Some sandboxes might not work properly in specific tasks temporarily, but we might
   * still want to run the other tasks. Set the ones to skip in this property.
   */
  skipTasks?: SkippableTask[];
  /**
   * Set this only while developing a newly created framework, to avoid using it in CI.
   * NOTE: Make sure to always add a TODO comment to remove this flag in a subsequent PR.
   */
  inDevelopment?: boolean;
  /**
   * Some sandboxes might need extra modifications in the initialized Storybook,
   * such as extend main.js, for setting specific feature flags like storyStoreV7, etc.
   */
  modifications?: {
    skipTemplateStories?: boolean;
    mainConfig?: Partial<StorybookConfig>;
    disableDocs?: boolean;
  };
  /**
   * Flag to indicate that this template is a secondary template, which is used mainly to test rather specific features.
   * This means the template might be hidden from the Storybook status page or the repro CLI command.
   * */
  isInternal?: boolean;
  projectType: ProjectType;
};

export const baseTemplates = {
  'cra/default-js': {
    name: 'Create React App (Webpack5 | JavaScript | npm)',
    script: 'npx create-react-app@latest {{beforeDir}}',
    expected: {
      // TODO: change this to @storybook/cra once that package is created
      framework: '@storybook/react-webpack5',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.REACT_SCRIPTS,
  },
  'cra/default-ts': {
    name: 'Create React App (Webpack5 | TypeScript | npm)',
    script: 'npx create-react-app@latest {{beforeDir}} --template typescript',
    // Re-enable once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'bench'],
    expected: {
      // TODO: change this to @storybook/cra once that package is created
      framework: '@storybook/react-webpack5',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    projectType: ProjectType.REACT_SCRIPTS,
  },
  'nextjs/12-js': {
    name: 'Next.js v12 (Webpack5 | JavaScript | npm)',
    script:
      'npm create next-app {{beforeDir}} -- -e https://github.com/vercel/next.js/tree/next-12-3-2/examples/hello-world && cd {{beforeDir}} && npm pkg set "dependencies.next"="^12.2.0" && npm i --prefer-offline --no-audit && git add . && git commit --amend --no-edit',
    expected: {
      framework: '@storybook/nextjs',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.NEXTJS,
  },
  'nextjs/default-js': {
    name: 'Next.js v13 (Webpack5 | JavaScript | npm)',
    script:
      'npm create next-app {{beforeDir}} -- --javascript --eslint --tailwind --app --import-alias="@/*" --src-dir',
    expected: {
      framework: '@storybook/nextjs',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.NEXTJS,
  },
  'nextjs/default-ts': {
    name: 'Next.js v13 (Webpack5 | TypeScript | npm)',
    script:
      'npm create next-app {{beforeDir}} -- --typescript --eslint --tailwind --app --import-alias="@/*" --src-dir',
    expected: {
      framework: '@storybook/nextjs',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.NEXTJS,
  },
  'react-vite/default-js': {
    name: 'React v18 (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template react',
    expected: {
      framework: '@storybook/react-vite',
      renderer: '@storybook/react',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.REACT,
  },
  'react-vite/default-ts': {
    name: 'React v18 (Vite | TypeScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template react-ts',
    expected: {
      framework: '@storybook/react-vite',
      renderer: '@storybook/react',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['bench'],
    projectType: ProjectType.REACT,
  },
  'react-webpack/18-ts': {
    name: 'React v18 (Webpack5 | TypeScript | npm)',
    script: 'npm create webpack5-react {{beforeDir}}',
    expected: {
      framework: '@storybook/react-webpack5',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.WEBPACK_REACT,
  },
  'react-webpack/17-ts': {
    name: 'React v17 (Webpack5 | TypeScript | npm)',
    script: 'npm create webpack5-react {{beforeDir}} --version-react="17" --version-react-dom="17"',
    expected: {
      framework: '@storybook/react-webpack5',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.WEBPACK_REACT,
  },
  'solid-vite/default-js': {
    name: 'Solid.js (Vite | JavaScript | npm)',
    script: 'npx degit solidjs/templates/js {{beforeDir}} && cd {{beforeDir}} && rm pnpm-lock.yaml',
    expected: {
      framework: 'storybook-solidjs-vite',
      renderer: 'storybook-solidjs',
      builder: '@storybook/builder-vite',
    },
    // TODO: remove this once solid-vite framework is released
    inDevelopment: true,
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.SOLID,
  },
  'solid-vite/default-ts': {
    name: 'Solid.js (Vite | TypeScript | npm)',
    script: 'npx degit solidjs/templates/ts {{beforeDir}} && cd {{beforeDir}} && rm pnpm-lock.yaml',
    expected: {
      framework: 'storybook-solidjs-vite',
      renderer: 'storybook-solidjs',
      builder: '@storybook/builder-vite',
    },
    // TODO: remove this once solid-vite framework is released
    inDevelopment: true,
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.SOLID,
  },
  'vue3-vite/default-js': {
    name: 'Vue.js v3 (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template vue',
    expected: {
      framework: '@storybook/vue3-vite',
      renderer: '@storybook/vue3',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.VUE3,
  },
  'vue3-vite/default-ts': {
    name: 'Vue.js v3 (Vite | TypeScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template vue-ts',
    expected: {
      framework: '@storybook/vue3-vite',
      renderer: '@storybook/vue3',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.VUE3,
  },
  'vue2-vite/2.7-js': {
    name: 'Vue.js v2 (Vite | JavaScript | npm)',
    script: 'npx create-vue@2 {{beforeDir}} --default',
    expected: {
      framework: '@storybook/vue-vite',
      renderer: '@storybook/vue',
      builder: '@storybook/builder-vite',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.VUE,
  },
  'html-webpack/default': {
    name: 'HTML (Webpack5 | JavaScript | npm)',
    script: 'npm create webpack5-html {{beforeDir}}',
    expected: {
      framework: '@storybook/html-webpack5',
      renderer: '@storybook/html',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.HTML,
  },
  'html-vite/default-js': {
    name: 'HTML (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template vanilla && cd {{beforeDir}}',
    expected: {
      framework: '@storybook/html-vite',
      renderer: '@storybook/html',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.HTML,
  },
  'html-vite/default-ts': {
    name: 'HTML (Vite | TypeScript | npm)',
    script:
      'npm create vite@latest --yes {{beforeDir}} -- --template vanilla-ts && cd {{beforeDir}}',
    expected: {
      framework: '@storybook/html-vite',
      renderer: '@storybook/html',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.HTML,
  },
  'svelte-vite/default-js': {
    name: 'Svelte (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template svelte',
    expected: {
      framework: '@storybook/svelte-vite',
      renderer: '@storybook/svelte',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.SVELTE,
  },
  'svelte-vite/default-ts': {
    name: 'Svelte (Vite | TypeScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template svelte-ts',
    expected: {
      framework: '@storybook/svelte-vite',
      renderer: '@storybook/svelte',
      builder: '@storybook/builder-vite',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.SVELTE,
  },
  'angular-cli/prerelease': {
    name: 'Angular v16 (Webpack5 | TypeScript | npm) (prerelease)',
    script:
      'npx -p @angular/cli@next ng new angular-v16 --directory {{beforeDir}} --routing=true --minimal=true --style=scss --strict --skip-git --skip-install',
    expected: {
      framework: '@storybook/angular',
      renderer: '@storybook/angular',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.ANGULAR,
  },
  'angular-cli/default-ts': {
    name: 'Angular v16 (Webpack5 | TypeScript | npm)',
    script:
      'npx -p @angular/cli@latest ng new angular-latest --directory {{beforeDir}} --routing=true --minimal=true --style=scss --strict --skip-git --skip-install',
    expected: {
      framework: '@storybook/angular',
      renderer: '@storybook/angular',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.ANGULAR,
  },
  'angular-cli/15-ts': {
    name: 'Angular v15 (Webpack5 | TypeScript | npm)',
    script:
      'npx -p @angular/cli@15 ng new angular-v15 --directory {{beforeDir}} --routing=true --minimal=true --style=scss --strict --skip-git --skip-install',
    expected: {
      framework: '@storybook/angular',
      renderer: '@storybook/angular',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.ANGULAR,
  },
  'svelte-kit/skeleton-js': {
    name: 'SvelteKit (Vite | JavaScript | npm)',
    script:
      'npm create svelte-with-args -- --name=svelte-kit/skeleton-js --directory={{beforeDir}} --template=skeleton --types=null --no-prettier --no-eslint --no-playwright --no-vitest',
    expected: {
      framework: '@storybook/sveltekit',
      renderer: '@storybook/svelte',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.SVELTEKIT,
  },
  'svelte-kit/skeleton-ts': {
    name: 'SvelteKit (Vite | TypeScript | npm)',
    script:
      'npm create svelte-with-args -- --name=svelte-kit/skeleton-ts --directory={{beforeDir}} --template=skeleton --types=typescript --no-prettier --no-eslint --no-playwright --no-vitest',
    expected: {
      framework: '@storybook/sveltekit',
      renderer: '@storybook/svelte',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.SVELTEKIT,
  },
  'lit-vite/default-js': {
    name: 'Lit (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template lit',
    expected: {
      framework: '@storybook/web-components-vite',
      renderer: '@storybook/web-components',
      builder: '@storybook/builder-vite',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.WEB_COMPONENTS,
  },
  'lit-vite/default-ts': {
    name: 'Lit (Vite | TypeScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template lit-ts',
    expected: {
      framework: '@storybook/web-components-vite',
      renderer: '@storybook/web-components',
      builder: '@storybook/builder-vite',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.WEB_COMPONENTS,
  },
  'vue-cli/default-js': {
    name: 'Vue.js v3 (Webpack5 | JavaScript | npm)',
    script:
      'npx -p @vue/cli@latest vue create {{beforeDir}} --default --force --merge --packageManager=npm && cd {{beforeDir}} && echo "module.exports = {}" > webpack.config.js',
    expected: {
      framework: '@storybook/vue3-webpack5',
      renderer: '@storybook/vue3',
      builder: '@storybook/builder-webpack5',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.VUE3,
  },
  'vue-cli/vue2-default-js': {
    name: 'Vue.js v2 (Webpack5 | JavaScript | npm)',
    script:
      'npx -p @vue/cli@latest vue create {{beforeDir}} --default --force --merge --preset="Default (Vue 2)" --packageManager=npm && cd {{beforeDir}} && echo "module.exports = {}" > webpack.config.js',
    expected: {
      framework: '@storybook/vue-webpack5',
      renderer: '@storybook/vue',
      builder: '@storybook/builder-webpack5',
    },
    // Remove smoke-test from the list once https://github.com/storybookjs/storybook/issues/19351 is fixed.
    skipTasks: ['smoke-test', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.VUE,
  },
  'preact-webpack5/default-js': {
    name: 'Preact (Webpack5 | JavaScript | npm)',
    script:
      'npx preact-cli@latest create default {{beforeDir}} --name preact-app --no-install && cd {{beforeDir}} && echo "module.exports = {}" > webpack.config.js',
    expected: {
      framework: '@storybook/preact-webpack5',
      renderer: '@storybook/preact',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.PREACT,
  },
  'preact-webpack5/default-ts': {
    name: 'Preact (Webpack5 | TypeScript | npm)',
    script:
      'npx preact-cli@latest create typescript {{beforeDir}} --name preact-app --no-install && cd {{beforeDir}} && echo "module.exports = {}" > webpack.config.js',
    expected: {
      framework: '@storybook/preact-webpack5',
      renderer: '@storybook/preact',
      builder: '@storybook/builder-webpack5',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.PREACT,
  },
  'preact-vite/default-js': {
    name: 'Preact (Vite | JavaScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template preact',
    expected: {
      framework: '@storybook/preact-vite',
      renderer: '@storybook/preact',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.PREACT,
  },
  'preact-vite/default-ts': {
    name: 'Preact (Vite | TypeScript | npm)',
    script: 'npm create vite@latest --yes {{beforeDir}} -- --template preact-ts',
    expected: {
      framework: '@storybook/preact-vite',
      renderer: '@storybook/preact',
      builder: '@storybook/builder-vite',
    },
    skipTasks: ['e2e-tests-dev', 'bench'],
    projectType: ProjectType.PREACT,
  },
  'qwik-vite/default-ts': {
    name: 'Qwik (Vite | TypeScript | npm)',
    script: 'npm create qwik basic {{beforeDir}} --no-install',
    // TODO: The community template does not provide standard stories, which is required for e2e tests. Reenable once it does.
    inDevelopment: true,
    expected: {
      framework: 'storybook-framework-qwik',
      renderer: 'storybook-framework-qwik',
      builder: 'storybook-framework-qwik',
    },
    // TODO: The community template does not provide standard stories, which is required for e2e tests.
    skipTasks: ['e2e-tests', 'e2e-tests-dev', 'bench'],
    projectType: ProjectType.QWIK,
  },
} satisfies Record<string, Template>;

export const pnpmTemplates = {
  'angular-cli-pnpm/default-ts': {
    ...baseTemplates['angular-cli/default-ts'],
    name: 'Angular v16 (Webpack5 | TypeScript | pnpm)',
    script:
      'pnpm --package @angular/cli dlx ng new angular-latest --directory {{beforeDir}} --routing=true --minimal=true --style=scss --strict --skip-git --package-manager=pnpm --skip-install && cd {{beforeDir}} && pnpm i --prefer-offline',
  },
  'lit-vite-pnpm/default-ts': {
    ...baseTemplates['lit-vite/default-ts'],
    name: 'Lit (Vite | TypeScript | pnpm)',
    script:
      'pnpm create vite@latest {{beforeDir}} --yes --template lit-ts && cd {{beforeDir}} && pnpm i --prefer-offline',
  },
  'vue3-vite-pnpm/default-ts': {
    ...baseTemplates['vue3-vite/default-ts'],
    name: 'Vue.js v3 (Vite | TypeScript | pnpm)',
    script:
      'pnpm create vite@latest {{beforeDir}} --yes --template vue-ts && cd {{beforeDir}} && pnpm i --prefer-offline',
  },
  'react-vite-pnpm/default-ts': {
    ...baseTemplates['react-vite/default-ts'],
    name: 'React v18 (Vite | TypeScript | pnpm)',
    script:
      'pnpm create vite@latest {{beforeDir}} --yes --template react-ts && cd {{beforeDir}} && pnpm i --prefer-offline',
  },
  // TODO: Investigate, why this sandbox cannot be created on CI
  // 'nextjs-pnpm/default-ts': {
  //   ...baseTemplates['nextjs/default-ts'],
  //   name: 'Next.js (Webpack5 | TypeScript | pnpm)',
  //   inDevelopment: true,
  //   script:
  //     'pnpm create next-app {{beforeDir}} --typescript --eslint --tailwind --app --import-alias="@/*" --src-dir --use-pnpm && cd {{beforeDir}} && pnpm i --prefer-offline',
  // },
} satisfies Record<string, Template>;

export const yarnTemplates = {
  'angular-cli-yarn/default-ts': {
    ...baseTemplates['angular-cli/default-ts'],
    name: 'Angular v16 (Webpack5 | TypeScript | yarn)',
    // enable node-linker mode and deactivate pnp mode since it is not supported
    script:
      'yarn dlx -p @angular/cli ng new angular-latest --directory {{beforeDir}} --routing=true --minimal=true --style=scss --strict --skip-git --package-manager=yarn --skip-install && cd {{beforeDir}} && touch yarn.lock && yarn set version berry && yarn config set nodeLinker node-modules',
  },
  'lit-vite-yarn/default-ts': {
    ...baseTemplates['lit-vite/default-ts'],
    name: 'Lit (Vite | TypeScript | yarn)',
    script:
      'yarn create vite {{beforeDir}} --yes --template lit-ts && cd {{beforeDir}} && touch yarn.lock && yarn set version berry && yarn config set nodeLinker pnp',
  },
  'vue3-vite-yarn/default-ts': {
    ...baseTemplates['vue3-vite/default-ts'],
    name: 'Vue.js v3 (Vite | TypeScript | yarn)',
    // enable node-linker mode and deactivate pnp mode since it is not supported
    script:
      'yarn create vite {{beforeDir}} --yes --template vue-ts && cd {{beforeDir}} && touch yarn.lock && yarn set version berry && yarn config set nodeLinker node-modules',
  },
  'react-vite-yarn/default-ts': {
    ...baseTemplates['react-vite/default-ts'],
    name: 'React v18 (Vite | TypeScript | yarn)',
    script:
      'yarn create vite {{beforeDir}} --yes --template react-ts && cd {{beforeDir}} && touch yarn.lock && yarn set version berry && yarn config set nodeLinker pnp',
  },
  // TODO: Investigate, why this sandbox cannot be created on CI
  // 'nextjs-yarn/default-ts': {
  //   ...baseTemplates['nextjs/default-ts'],
  //   name: 'Next.js (Webpack5 | TypeScript | yarn)',
  //   inDevelopment: true,
  //   script:
  //     'yarn create next-app {{beforeDir}} --typescript --eslint --tailwind --app --import-alias="@/*" --src-dir --use-yarn && cd {{beforeDir}} && touch yarn.lock && yarn set version berry && yarn config set nodeLinker pnp',
  // },
} satisfies Record<string, Template>;

/**
 * Internal templates reuse config from other templates and add extra config on top.
 * They must contain an id that starts with 'internal/' and contain "isInternal: true".
 * They will be hidden by default in the Storybook status page.
 */
const internalTemplates = {
  'internal/ssv6-vite': {
    ...baseTemplates['react-vite/default-ts'],
    name: 'StoryStore v6 React (Vite | TypeScript | npm)',
    isInternal: true,
    modifications: {
      mainConfig: {
        features: {
          storyStoreV7: false,
          storyStoreV7MdxErrors: false,
        },
      },
    },
    skipTasks: ['bench'],
    projectType: ProjectType.REACT,
  },
  'internal/ssv6-webpack': {
    ...baseTemplates['cra/default-ts'],
    name: 'StoryStore v6 CRA (Webpack5 | TypeScript | npm)',
    isInternal: true,
    modifications: {
      mainConfig: {
        features: {
          storyStoreV7: false,
          storyStoreV7MdxErrors: false,
        },
      },
    },
    skipTasks: ['bench'],
    projectType: ProjectType.REACT_SCRIPTS,
  },
  'internal/swc-webpack': {
    ...baseTemplates['react-webpack/18-ts'],
    name: 'SWC React (Webpack5 | TypeScript | npm)',
    isInternal: true,
    inDevelopment: true,
    modifications: {
      mainConfig: {
        framework: {
          name: '@storybook/react-webpack5',
          options: {
            builder: {
              useSWC: true,
            },
          },
        },
      },
    },
    skipTasks: ['bench'],
    projectType: ProjectType.WEBPACK_REACT,
  },
  'internal/server-webpack5': {
    name: 'Server (Webpack5 | JavaScript | npm)',
    script: 'npm init -y && echo "module.exports = {}" > webpack.config.js',
    expected: {
      framework: '@storybook/server-webpack5',
      renderer: '@storybook/server',
      builder: '@storybook/builder-webpack5',
    },
    isInternal: true,
    skipTasks: ['bench'],
    projectType: ProjectType.SERVER,
  },
  // 'internal/pnp': {
  //   ...baseTemplates['cra/default-ts'],
  //   name: 'PNP (cra/default-ts)',
  //   script: 'npm create react-app . --use-pnp',
  //   isInternal: true,
  //   inDevelopment: true,
  // },
} satisfies Record<`internal/${string}`, Template & { isInternal: true }>;

const benchTemplates = {
  'bench/react-vite-default-ts': {
    ...baseTemplates['react-vite/default-ts'],
    name: 'Bench React (Vite | TypeScript | npm)',
    isInternal: true,
    modifications: {
      skipTemplateStories: true,
    },
    skipTasks: ['e2e-tests-dev', 'test-runner', 'test-runner-dev', 'e2e-tests', 'chromatic'],
    projectType: ProjectType.REACT,
  },
  'bench/react-webpack-18-ts': {
    ...baseTemplates['react-webpack/18-ts'],
    name: 'Bench React (Webpack5 | TypeScript | npm)',
    isInternal: true,
    modifications: {
      skipTemplateStories: true,
    },
    skipTasks: ['e2e-tests-dev', 'test-runner', 'test-runner-dev', 'e2e-tests', 'chromatic'],
    projectType: ProjectType.WEBPACK_REACT,
  },
  'bench/react-vite-default-ts-nodocs': {
    ...baseTemplates['react-vite/default-ts'],
    name: 'Bench (react-vite/default-ts, no docs)',
    isInternal: true,
    modifications: {
      skipTemplateStories: true,
      disableDocs: true,
    },
    skipTasks: ['e2e-tests-dev', 'test-runner', 'test-runner-dev', 'e2e-tests', 'chromatic'],
  },
} satisfies Record<`bench/${string}`, Template & { isInternal: true }>;

export const allTemplates = {
  ...baseTemplates,
  ...internalTemplates,
  ...benchTemplates,
  ...yarnTemplates,
  ...pnpmTemplates,
} satisfies Record<TemplateKey, Template>;

export const sandboxTemplates = {
  ...baseTemplates,
  ...yarnTemplates,
  ...pnpmTemplates,
} satisfies { [key in TemplateKey]?: Template };

export const normal: TemplateKey[] = [
  'cra/default-ts',
  'react-vite/default-ts',
  'angular-cli/default-ts',
  'vue3-vite/default-ts',
  'vue-cli/vue2-default-js',
  'lit-vite/default-ts',
  'svelte-vite/default-ts',
  'svelte-kit/skeleton-ts',
  'nextjs/default-ts',
  'bench/react-vite-default-ts',
  'bench/react-webpack-18-ts',
  'bench/react-vite-default-ts-nodocs',
];
export const merged: TemplateKey[] = [
  ...normal,
  'react-webpack/18-ts',
  'react-webpack/17-ts',
  'angular-cli/15-ts',
  'preact-webpack5/default-ts',
  'preact-vite/default-ts',
  'html-webpack/default',
  'html-vite/default-ts',
  'internal/ssv6-vite',
  'internal/ssv6-webpack',
];
export const daily: TemplateKey[] = [
  // npm sandboxes
  ...merged,
  'angular-cli/prerelease',
  'cra/default-js',
  'react-vite/default-js',
  'vue3-vite/default-js',
  'vue2-vite/2.7-js',
  'vue-cli/default-js',
  'lit-vite/default-js',
  'svelte-kit/skeleton-js',
  'svelte-vite/default-js',
  'nextjs/12-js',
  'nextjs/default-js',
  'qwik-vite/default-ts',
  'preact-webpack5/default-js',
  'preact-vite/default-js',
  'html-vite/default-js',
  // These sandboxes are not set up in chromatic so far and weren't tested in ci daily mode
  // pnpm sandboxes
  // 'angular-cli-pnpm/default-ts',
  // 'lit-vite-pnpm/default-ts',
  // 'vue3-vite-pnpm/default-ts',
  // 'react-vite-pnpm/default-ts',
  // yarn sandboxes
  // 'angular-cli-yarn/default-ts',
  // 'lit-vite-yarn/default-ts',
  // 'vue3-vite-yarn/default-ts',
  // 'react-vite-yarn/default-ts',
];

export const templatesByCadence = { normal, merged, daily };

export const isPnpmTemplate = (templateKey: Template['name'] | TemplateKey) =>
  templateKey.includes('pnpm');
