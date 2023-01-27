import { webpackStatsToModulesJson } from './modules-json';

const CSF_GLOB = './src sync ^\\.\\/(?:(?!\\.)(?=.)[^/]*?\\.stories\\.js)$';

const stats = (modules: any) => ({
  toJson() {
    return { modules };
  },
});

describe('webpackStatsToModulesJson', () => {
  it('should trim unneeded webpack stats properties', () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './src/foo.stories.ts',
          identifier:
            '/Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/builder-webpack4/node_modules/babel-loader/lib/index.js??ref--4-0!/Users/ghengeveld/Development/Chromatic/shapes-light/src/foo.stories.ts',
          name: './src/foo.stories.ts',
          chunks: [4],
          issuer:
            'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/src/foo.stories.ts',
          issuerId: 0,
          issuerName:
            'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./src/foo.stories.ts',
          issuerPath: [
            {
              id: 0,
              identifier:
                'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/src/foo.stories.ts',
              name: 'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./src/foo.stories.ts',
            },
          ],
          assets: [],
          reasons: [
            {
              moduleId: CSF_GLOB,
              moduleIdentifier:
                'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/src/foo.stories.ts',
              module:
                'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./src/foo.stories.ts',
              moduleName:
                'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./src/foo.stories.ts',
              type: 'single entry',
              userRequest:
                '/Users/ghengeveld/Development/Chromatic/shapes-light/src/foo.stories.ts',
              loc: 'main[14]',
            },
          ],
          optimizationBailout: ['ModuleConcatenation bailout: Module is not an ECMAScript module'],
          source:
            '"use strict";\n\nvar _frameworkImportPath = require("@storybook/react");\n/* eslint-disable import/no-unresolved */\n\n\n(0, _frameworkImportPath.configure)([require.context(\'./src\', true, /^\\.(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)(?!\\.)(?=.)[^/]*?\\.stories\\.mdx)$/), require.context(\'./src\', true, /^\\.(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)(?!\\.)(?=.)[^/]*?\\.stories\\.(js|jsx|ts|tsx))$/)], module, false);',
        },
        {
          id: CSF_GLOB,
          reasons: [{ moduleId: './storybook-stories.js' }],
        },
        {
          id: './storybook-stories.js',
          reasons: [{ moduleId: './storybook-config-entry.js' }],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/foo.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        type: 'glob',
        reasons: new Set(['./storybook-stories.js']),
      },
      './storybook-stories.js': {
        type: 'entry',
        reasons: new Set(),
      },
    });
  });

  it('marks each module with a "type"', async () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './src/some-random-file.ts',
          reasons: [],
        },
        {
          id: './src/foo.component.ts',
          reasons: [{ moduleId: './src/foo.stories.ts' }],
        },
        {
          id: './src/foo.stories.ts',
          reasons: [{ moduleId: CSF_GLOB }],
        },
        {
          id: CSF_GLOB,
          reasons: [{ moduleId: './storybook-stories.js' }],
        },
        {
          id: './storybook-stories.js',
          reasons: [{ moduleId: './storybook-config-entry.js' }],
        },
        {
          id: './.storybook/preview.js',
          reasons: [{ moduleId: './storybook-config-entry.js' }],
        },
        {
          id: './storybook-config-entry.js',
          reasons: [{ moduleId: null }],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/some-random-file.ts': {
        type: 'source',
        reasons: new Set(),
      },
      './src/foo.component.ts': {
        type: 'source',
        reasons: new Set(['./src/foo.stories.ts']),
      },
      './src/foo.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        type: 'glob',
        reasons: new Set(['./storybook-stories.js']),
      },
      './.storybook/preview.js': {
        type: 'config',
        reasons: new Set(['./storybook-config-entry.js']),
      },
      './storybook-stories.js': {
        type: 'entry',
        reasons: new Set(['./storybook-config-entry.js']),
      },
      './storybook-config-entry.js': {
        type: 'entry',
        reasons: new Set(),
      },
    });
  });

  it('handles reverse module order', async () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './storybook-config-entry.js',
          reasons: [{ moduleId: null }],
        },
        {
          id: './.storybook/preview.js',
          reasons: [{ moduleId: './storybook-config-entry.js' }],
        },
        {
          id: './storybook-stories.js',
          reasons: [{ moduleId: './storybook-config-entry.js' }],
        },
        {
          id: CSF_GLOB,
          reasons: [{ moduleId: './storybook-stories.js' }],
        },
        {
          id: './src/foo.stories.ts',
          reasons: [{ moduleId: CSF_GLOB }],
        },
        {
          id: './src/foo.component.ts',
          reasons: [{ moduleId: './src/foo.stories.ts' }],
        },
        {
          id: './src/some-random-file.ts',
          reasons: [],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/some-random-file.ts': {
        type: 'source',
        reasons: new Set(),
      },
      './src/foo.component.ts': {
        type: 'source',
        reasons: new Set(['./src/foo.stories.ts']),
      },
      './src/foo.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        type: 'glob',
        reasons: new Set(['./storybook-stories.js']),
      },
      './.storybook/preview.js': {
        type: 'config',
        reasons: new Set(['./storybook-config-entry.js']),
      },
      './storybook-stories.js': {
        type: 'entry',
        reasons: new Set(['./storybook-config-entry.js']),
      },
      './storybook-config-entry.js': {
        type: 'entry',
        reasons: new Set(),
      },
    });
  });

  it('recurses into child modules', async () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './src/foo.component.ts',
          reasons: [
            { moduleId: './src/foo.stories.ts' },
            { moduleId: './src/bar.stories.ts' },
            { moduleId: './src/foo.component.ts' },
          ],
          modules: [
            {
              id: './src/foo.component.ts',
              reasons: [{ moduleId: './src/foo.stories.ts' }, { moduleId: './src/bar.stories.ts' }],
            },
            {
              id: './src/util.ts',
              reasons: [
                { moduleId: './src/foo.stories.ts' },
                { moduleId: './src/foo.component.ts' },
              ],
            },
          ],
        },
        {
          id: './src/foo.stories.ts',
          reasons: [{ moduleId: CSF_GLOB }],
        },
        {
          id: './src/bar.stories.ts',
          reasons: [{ moduleId: CSF_GLOB }],
        },
        {
          id: CSF_GLOB,
          reasons: [{ moduleId: './storybook-stories.js' }],
        },
        {
          id: './storybook-stories.js',
          reasons: [],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/foo.component.ts': {
        type: 'source',
        reasons: new Set(['./src/foo.stories.ts', './src/bar.stories.ts']),
      },
      './src/util.ts': {
        type: 'source',
        reasons: new Set(['./src/foo.stories.ts', './src/foo.component.ts']),
      },
      './src/foo.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      './src/bar.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        type: 'glob',
        reasons: new Set(['./storybook-stories.js']),
      },
      './storybook-stories.js': {
        type: 'entry',
        reasons: new Set(),
      },
    });
  });

  it('should trim URL parameters in module identifiers', () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './src/foo.css?ngResource', // note the ?ngResource
          reasons: [{ moduleId: './src/foo.component.ts' }],
        },
        {
          id: './src/foo.component.ts',
          reasons: [{ moduleId: './src/foo.stories.ts' }],
        },
        {
          id: './src/foo.stories.ts',
          reasons: [{ moduleId: CSF_GLOB }],
        },
        {
          id: CSF_GLOB,
          reasons: [{ moduleId: './storybook-stories.js' }],
        },
        {
          id: './storybook-stories.js',
          reasons: [],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/foo.css': {
        type: 'source',
        reasons: new Set(['./src/foo.component.ts']),
      },
      './src/foo.component.ts': {
        type: 'source',
        reasons: new Set(['./src/foo.stories.ts']),
      },
      './src/foo.stories.ts': {
        type: 'stories',
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        type: 'glob',
        reasons: new Set(['./storybook-stories.js']),
      },
      './storybook-stories.js': {
        type: 'entry',
        reasons: new Set(),
      },
    });
  });

  it('should properly parse full webpack stats file', async () => {
    const data = (await import('./__mockdata__/preview-stats.min.json')) as any;
    const modules = webpackStatsToModulesJson(stats(data.modules));

    expect(modules.get('./stories/button.css')).toEqual({
      type: 'source',
      reasons: new Set(['./stories/Button.jsx']),
    });

    expect(modules.get('./stories/Button.jsx')).toEqual({
      type: 'source',
      reasons: new Set(['./stories/Button.stories.js', './stories/Header.jsx']),
    });

    expect(modules.get('./stories/Header.jsx')).toEqual({
      type: 'source',
      reasons: new Set([
        './stories/Header.stories.js',
        './stories/Page.jsx',
        './stories/Page.stories.js',
      ]),
    });

    expect(modules.get('./stories/Button.stories.js')).toEqual({
      type: 'stories',
      reasons: new Set([
        './stories lazy recursive ^\\.\\/.*$ include: (?:\\/stories(?:\\/(?%21\\.)(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/%7C\\/%7C$)(?%21\\.)(?=.)[^/]*?\\.stories\\.(js%7Cjsx%7Cts%7Ctsx))$',
      ]),
    });

    expect(modules.get('./stories/Header.stories.js')).toEqual({
      type: 'stories',
      reasons: new Set([
        './stories lazy recursive ^\\.\\/.*$ include: (?:\\/stories(?:\\/(?%21\\.)(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/%7C\\/%7C$)(?%21\\.)(?=.)[^/]*?\\.stories\\.(js%7Cjsx%7Cts%7Ctsx))$',
      ]),
    });

    expect(
      modules.get(
        './stories lazy recursive ^\\.\\/.*$ include: (?:\\/stories(?:\\/(?%21\\.)(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/%7C\\/%7C$)(?%21\\.)(?=.)[^/]*?\\.stories\\.(js%7Cjsx%7Cts%7Ctsx))$'
      )
    ).toEqual({
      type: 'glob',
      reasons: new Set(['./storybook-config-entry.js', './storybook-stories.js']),
    });

    expect(modules.get('./storybook-stories.js')).toEqual({
      type: 'entry',
      reasons: new Set(['./storybook-config-entry.js']),
    });

    expect(modules.get('./storybook-config-entry.js')).toEqual({
      type: 'entry',
      reasons: new Set(),
    });

    expect(modules.get('./node_modules/react/index.js')).toEqual({
      type: 'source',
      reasons: expect.any(Set),
    });
  });
});
