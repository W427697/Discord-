const craTemplates = {
  'cra/default-js': {
    name: 'Create React App (Javascript)',
    script: 'npx create-react-app .',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/cra',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
  },
  'cra/default-ts': {
    name: 'Create React App (Typescript)',
    script: 'npx create-react-app . --template typescript',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/cra',
      renderer: '@storybook/react',
      builder: '@storybook/builder-webpack5',
    },
  },
};

const reactViteTemplates = {
  'react-vite/default-js': {
    name: 'React Vite (JS)',
    script: 'yarn create vite . --template react',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/react-vite',
      renderer: '@storybook/react',
      builder: '@storybook/builder-vite',
    },
  },
  'react-vite/default-ts': {
    name: 'React Vite (TS)',
    script: 'yarn create vite . --template react-ts',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/react-vite',
      renderer: '@storybook/react',
      builder: '@storybook/builder-vite',
    },
  },
};

const vue3ViteTemplates = {
  'vue3-vite/default-js': {
    name: 'Vue3 Vite (JS)',
    script: 'yarn create vite . --template vue',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/vue3-vite',
      renderer: '@storybook/vue3',
      builder: '@storybook/builder-vite',
    },
  },
  'vue3-vite/default-ts': {
    name: 'Vue3 Vite (TS)',
    script: 'yarn create vite . --template vue-ts',
    cadence: ['ci', 'daily', 'weekly'],
    expected: {
      framework: '@storybook/vue3-vite',
      renderer: '@storybook/vue3',
      builder: '@storybook/builder-vite',
    },
  },
};

export default {
  ...craTemplates,
  ...reactViteTemplates,
  ...vue3ViteTemplates,
  // FIXME: missing documentation.json
  // 'angular/latest': {
  //   name: 'Angular (latest)',
  //   script:
  //     'npx -p @angular/cli ng new angular-latest --directory . --routing=true --minimal=true --style=scss --skip-install=true --strict',
  //   cadence: ['ci', 'daily', 'weekly'],
  //   expected: {
  //     framework: '@storybook/angular',
  //     renderer: '@storybook/angular',
  //     builder: '@storybook/builder-webpack5',
  //   },
  // },
} as const;
