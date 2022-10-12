import { webpackStatsToModulesJson } from './modules-json';

const CSF_GLOB = './src sync ^\\.\\/(?:(?!\\.)(?=.)[^/]*?\\.stories\\.js)$';

const stats = (modules) => ({
  toJson() {
    return { modules };
  },
});

describe('webpackStatsToModulesJson', () => {
  it('should trim unneeded webpack stats properties', () => {
    const modules = webpackStatsToModulesJson(
      stats([
        {
          id: './generated-stories-entry.js',
          identifier:
            '/Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/builder-webpack4/node_modules/babel-loader/lib/index.js??ref--4-0!/Users/ghengeveld/Development/Chromatic/shapes-light/generated-stories-entry.js',
          name: './generated-stories-entry.js',
          chunks: [4],
          issuer:
            'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/generated-stories-entry.js',
          issuerId: 0,
          issuerName:
            'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./generated-stories-entry.js',
          issuerPath: [
            {
              id: 0,
              identifier:
                'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/generated-stories-entry.js',
              name: 'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./generated-stories-entry.js',
            },
          ],
          assets: [],
          reasons: [
            {
              moduleId: 0,
              moduleIdentifier:
                'multi /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/core-client/dist/esm/globals/globals.js /Users/ghengeveld/Development/Chromatic/shapes-light/storybook-init-framework-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/.storybook/preview.js-generated-config-entry.js /Users/ghengeveld/Development/Chromatic/shapes-light/generated-stories-entry.js',
              module:
                'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./generated-stories-entry.js',
              moduleName:
                'multi ./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js ./node_modules/@storybook/core-client/dist/esm/globals/globals.js ./storybook-init-framework-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js-generated-config-entry.js ./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js-generated-config-entry.js ./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js ./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js-generated-config-entry.js ./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js-generated-config-entry.js ./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js-generated-config-entry.js ./.storybook/preview.js-generated-config-entry.js ./generated-stories-entry.js',
              type: 'single entry',
              userRequest:
                '/Users/ghengeveld/Development/Chromatic/shapes-light/generated-stories-entry.js',
              loc: 'main[14]',
            },
          ],
          optimizationBailout: ['ModuleConcatenation bailout: Module is not an ECMAScript module'],
          source:
            '"use strict";\n\nvar _frameworkImportPath = require("@storybook/react");\n/* eslint-disable import/no-unresolved */\n\n\n(0, _frameworkImportPath.configure)([require.context(\'./src\', true, /^\\.(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)(?!\\.)(?=.)[^/]*?\\.stories\\.mdx)$/), require.context(\'./src\', true, /^\\.(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)(?!\\.)(?=.)[^/]*?\\.stories\\.(js|jsx|ts|tsx))$/)], module, false);',
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './generated-stories-entry.js': { reasons: new Set() },
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
          reasons: [{ moduleId: './.storybook/generated-stories-entry.js' }],
        },
      ])
    );

    expect(Object.fromEntries(modules)).toEqual({
      './src/foo.css': {
        reasons: new Set(['./src/foo.component.ts']),
      },
      './src/foo.component.ts': {
        reasons: new Set(['./src/foo.stories.ts']),
      },
      './src/foo.stories.ts': {
        reasons: new Set([CSF_GLOB]),
      },
      [CSF_GLOB]: {
        reasons: new Set(),
      },
    });
  });
});
