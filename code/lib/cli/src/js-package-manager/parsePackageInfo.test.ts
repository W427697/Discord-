import type { NpmListOutput, PnpmListOutput, Yarn1ListOutput } from './parsePackageInfo';
import {
  mapDependenciesNpm,
  mapDependenciesPnpm,
  mapDependenciesYarn1,
  mapDependenciesYarn2,
} from './parsePackageInfo';

// yarn list --pattern "@storybook/*" "@storybook/react" --recursive --json
const yarn1ListOutput: Yarn1ListOutput = {
  type: 'tree',
  data: {
    type: 'list',
    trees: [
      {
        name: 'unrelated-and-should-be-filtered@1.0.0',
        children: [],
      },
      {
        name: '@storybook/instrumenter@7.0.0-beta.12',
        children: [
          {
            name: '@storybook/types@7.0.0-beta.12',
            children: [] as any,
          },
        ],
      },
      {
        name: '@storybook/addon-interactions@7.0.0-beta.19',
        children: [
          {
            name: '@storybook/instrumenter@7.0.0-beta.19',
            children: [] as any,
          },
        ],
      },
    ],
  },
};

// yarn info --name-only --recursive "@storybook/*" "storybook"
const yarn2InfoOutput = `
"unrelated-and-should-be-filtered@npm:1.0.0"
"@storybook/global@npm:5.0.0"
"@storybook/instrumenter@npm:7.0.0-beta.12"
"@storybook/instrumenter@npm:7.0.0-beta.19"
"@storybook/jest@npm:0.0.11-next.0"
"@storybook/manager-api@npm:7.0.0-beta.19"
"@storybook/manager@npm:7.0.0-beta.19"
"@storybook/mdx2-csf@npm:0.1.0-next.5"
`;

// pnpm list "@storybook/*" "storybook" --depth 10 --json
const pnpmListOutput: PnpmListOutput = [
  {
    peerDependencies: {
      'unrelated-and-should-be-filtered': {
        version: '1.0.0',
        from: '',
        resolved: '',
      },
    },
    dependencies: {
      '@storybook/addon-interactions': {
        from: '@storybook/addon-interactions',
        version: '7.0.0-beta.13',
        resolved:
          'https://registry.npmjs.org/@storybook/addon-interactions/-/addon-interactions-7.0.0-beta.13.tgz',
        dependencies: {
          '@storybook/instrumenter': {
            from: '@storybook/instrumenter',
            version: '7.0.0-beta.13',
            resolved:
              'https://registry.npmjs.org/@storybook/instrumenter/-/instrumenter-7.0.0-beta.13.tgz',
          },
        },
      },
    },
    devDependencies: {
      '@storybook/jest': {
        from: '@storybook/jest',
        version: '0.0.11-next.0',
        resolved: 'https://registry.npmjs.org/@storybook/jest/-/jest-0.0.11-next.0.tgz',
        dependencies: {
          '@storybook/instrumenter': {
            from: '@storybook/instrumenter',
            version: '7.0.0-rc.7',
            resolved:
              'https://registry.npmjs.org/@storybook/instrumenter/-/instrumenter-7.0.0-rc.7.tgz',
          },
        },
      },
      '@storybook/testing-library': {
        from: '@storybook/testing-library',
        version: '0.0.14-next.1',
        resolved:
          'https://registry.npmjs.org/@storybook/testing-library/-/testing-library-0.0.14-next.1.tgz',
        dependencies: {
          '@storybook/instrumenter': {
            from: '@storybook/instrumenter',
            version: '7.0.0-rc.7',
            resolved:
              'https://registry.npmjs.org/@storybook/instrumenter/-/instrumenter-7.0.0-rc.7.tgz',
          },
        },
      },
      '@storybook/nextjs': {
        from: '@storybook/nextjs',
        version: '7.0.0-beta.13',
        resolved: 'https://registry.npmjs.org/@storybook/nextjs/-/nextjs-7.0.0-beta.13.tgz',
        dependencies: {
          '@storybook/builder-webpack5': {
            from: '@storybook/builder-webpack5',
            version: '7.0.0-beta.13',
            resolved:
              'https://registry.npmjs.org/@storybook/builder-webpack5/-/builder-webpack5-7.0.0-beta.13.tgz',
            dependencies: {
              '@storybook/addons': {
                from: '@storybook/addons',
                version: '7.0.0-beta.13',
                resolved: 'https://registry.npmjs.org/@storybook/addons/-/addons-7.0.0-beta.13.tgz',
              },
            },
          },
        },
      },
    },
  },
];

// npm ls --depth 10 --json | grep storybook
const npmListOutput: NpmListOutput = {
  dependencies: {
    'unrelated-and-should-be-filtered': {
      version: '1.0.0',
    },
    '@storybook/addon-interactions': {
      version: '7.0.0-rc.7',
      resolved:
        'https://registry.npmjs.org/@storybook/addon-interactions/-/addon-interactions-7.0.0-rc.7.tgz',
      overridden: false,
      dependencies: {
        '@storybook/instrumenter': {
          version: '6.0.0',
          resolved:
            'https://registry.npmjs.org/@storybook/instrumenter/-/instrumenter-7.0.0-rc.7.tgz',
          overridden: false,
          dependencies: {
            '@storybook/channels': {
              version: '7.0.0-rc.7',
            },
            '@storybook/client-logger': {
              version: '7.0.0-rc.7',
            },
            '@storybook/core-events': {
              version: '7.0.0-rc.7',
            },
            '@storybook/global': {
              version: '5.0.0',
            },
            '@storybook/preview-api': {
              version: '7.0.0-rc.7',
            },
          },
        },
      },
    },
    '@storybook/instrumenter': {
      version: '7.0.0-beta.11',
      resolved:
        'https://registry.npmjs.org/@storybook/instrumenter/-/instrumenter-7.0.0-beta.11.tgz',
      overridden: false,
      dependencies: {},
    },
    '@storybook/jest': {
      version: '0.0.11-next.1',
      resolved: 'https://registry.npmjs.org/@storybook/jest/-/jest-0.0.11-next.1.tgz',
      overridden: false,
      dependencies: {
        '@storybook/instrumenter': {
          version: '7.0.0-alpha.21',
        },
      },
    },
    '@storybook/testing-library': {
      version: '0.0.14-next.1',
      resolved:
        'https://registry.npmjs.org/@storybook/testing-library/-/testing-library-0.0.14-next.1.tgz',
      overridden: false,
      dependencies: {
        '@storybook/instrumenter': {
          version: '5.4.2-alpha.0',
        },
      },
    },
  },
};

describe('mapDependencies', () => {
  it('yarn classic format', () => {
    const result = mapDependenciesYarn1(yarn1ListOutput);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependencies": Object {
          "@storybook/addon-interactions": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.19",
            },
          ],
          "@storybook/instrumenter": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.12",
            },
            Object {
              "location": "",
              "version": "7.0.0-beta.19",
            },
          ],
          "@storybook/types": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.12",
            },
          ],
        },
        "duplicatedDependencies": Object {
          "@storybook/instrumenter": Array [
            "7.0.0-beta.12",
            "7.0.0-beta.19",
          ],
        },
        "infoCommand": "yarn why",
      }
    `);
  });
  it('yarn 2+ (berry) format', () => {
    const result = mapDependenciesYarn2(yarn2InfoOutput);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependencies": Object {
          "@storybook/global": Array [
            Object {
              "location": "",
              "version": "5.0.0",
            },
          ],
          "@storybook/instrumenter": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.12",
            },
            Object {
              "location": "",
              "version": "7.0.0-beta.19",
            },
          ],
          "@storybook/jest": Array [
            Object {
              "location": "",
              "version": "0.0.11-next.0",
            },
          ],
          "@storybook/manager": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.19",
            },
          ],
          "@storybook/manager-api": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.19",
            },
          ],
          "@storybook/mdx2-csf": Array [
            Object {
              "location": "",
              "version": "0.1.0-next.5",
            },
          ],
        },
        "duplicatedDependencies": Object {
          "@storybook/instrumenter": Array [
            "7.0.0-beta.12",
            "7.0.0-beta.19",
          ],
        },
        "infoCommand": "yarn why",
      }
    `);
  });
  it('pnpm format', () => {
    const result = mapDependenciesPnpm(pnpmListOutput);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependencies": Object {
          "@storybook/addon-interactions": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.13",
            },
          ],
          "@storybook/addons": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.13",
            },
          ],
          "@storybook/builder-webpack5": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.13",
            },
          ],
          "@storybook/instrumenter": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
            Object {
              "location": "",
              "version": "7.0.0-beta.13",
            },
          ],
          "@storybook/jest": Array [
            Object {
              "location": "",
              "version": "0.0.11-next.0",
            },
          ],
          "@storybook/nextjs": Array [
            Object {
              "location": "",
              "version": "7.0.0-beta.13",
            },
          ],
          "@storybook/testing-library": Array [
            Object {
              "location": "",
              "version": "0.0.14-next.1",
            },
          ],
        },
        "duplicatedDependencies": Object {
          "@storybook/instrumenter": Array [
            "7.0.0-rc.7",
            "7.0.0-beta.13",
          ],
        },
        "infoCommand": "pnpm list --depth=1",
      }
    `);
  });
  it('npm format', () => {
    const result = mapDependenciesNpm(npmListOutput);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependencies": Object {
          "@storybook/addon-interactions": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
          ],
          "@storybook/channels": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
          ],
          "@storybook/client-logger": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
          ],
          "@storybook/core-events": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
          ],
          "@storybook/global": Array [
            Object {
              "location": "",
              "version": "5.0.0",
            },
          ],
          "@storybook/instrumenter": Array [
            Object {
              "location": "",
              "version": "6.0.0",
            },
            Object {
              "location": "",
              "version": "7.0.0-beta.11",
            },
            Object {
              "location": "",
              "version": "7.0.0-alpha.21",
            },
            Object {
              "location": "",
              "version": "5.4.2-alpha.0",
            },
          ],
          "@storybook/jest": Array [
            Object {
              "location": "",
              "version": "0.0.11-next.1",
            },
          ],
          "@storybook/preview-api": Array [
            Object {
              "location": "",
              "version": "7.0.0-rc.7",
            },
          ],
          "@storybook/testing-library": Array [
            Object {
              "location": "",
              "version": "0.0.14-next.1",
            },
          ],
        },
        "duplicatedDependencies": Object {
          "@storybook/instrumenter": Array [
            "5.4.2-alpha.0",
            "6.0.0",
            "7.0.0-alpha.21",
            "7.0.0-beta.11",
          ],
        },
        "infoCommand": "npm ls --depth=1",
      }
    `);
  });
});
