import { PNPMProxy } from './PNPMProxy';

describe('NPM Proxy', () => {
  let pnpmProxy: PNPMProxy;

  beforeEach(() => {
    pnpmProxy = new PNPMProxy();
  });

  it('type should be npm', () => {
    expect(pnpmProxy.type).toEqual('pnpm');
  });

  describe('initPackageJson', () => {
    it('should run `npm init -y`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('');

      pnpmProxy.initPackageJson();

      expect(executeCommandSpy).toHaveBeenCalledWith('pnpm', ['init', '-y']);
    });
  });

  describe('setRegistryUrl', () => {
    it('should run `npm config set registry https://foo.bar`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('');

      pnpmProxy.setRegistryURL('https://foo.bar');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'config',
        'set',
        'registry',
        'https://foo.bar',
      ]);
    });
  });

  describe('installDependencies', () => {
    it('should run `pnpm install`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('7.1.0');

      pnpmProxy.installDependencies();

      expect(executeCommandSpy).toHaveBeenLastCalledWith('pnpm', ['install'], expect.any(String));
    });
  });

  describe('runScript', () => {
    it('should execute script `yarn compodoc -- -e json -d .`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('7.1.0');

      pnpmProxy.runPackageCommand('compodoc', ['-e', 'json', '-d', '.']);

      expect(executeCommandSpy).toHaveBeenLastCalledWith(
        'pnpm',
        ['exec', 'compodoc', '-e', 'json', '-d', '.'],
        undefined,
        undefined
      );
    });
  });

  describe('addDependencies', () => {
    it('with devDep it should run `pnpm add -D @junk-temporary-prototypes/preview-api`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('6.0.0');

      pnpmProxy.addDependencies({ installAsDevDependencies: true }, ['@junk-temporary-prototypes/preview-api']);

      expect(executeCommandSpy).toHaveBeenLastCalledWith(
        'pnpm',
        ['add', '-D', '@junk-temporary-prototypes/preview-api'],
        expect.any(String)
      );
    });
  });

  describe('removeDependencies', () => {
    it('with devDep it should run `npm uninstall @junk-temporary-prototypes/preview-api`', () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('6.0.0');

      pnpmProxy.removeDependencies({}, ['@junk-temporary-prototypes/preview-api']);

      expect(executeCommandSpy).toHaveBeenLastCalledWith(
        'pnpm',
        ['remove', '@junk-temporary-prototypes/preview-api'],
        expect.any(String)
      );
    });

    describe('skipInstall', () => {
      it('should only change package.json without running install', () => {
        const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('7.0.0');
        const writePackageSpy = jest
          .spyOn(pnpmProxy, 'writePackageJson')
          .mockImplementation(jest.fn);

        pnpmProxy.removeDependencies(
          {
            skipInstall: true,
            packageJson: {
              devDependencies: {
                '@junk-temporary-prototypes/manager-webpack5': 'x.x.x',
                '@junk-temporary-prototypes/react': 'x.x.x',
              },
            },
          },
          ['@junk-temporary-prototypes/manager-webpack5']
        );

        expect(writePackageSpy).toHaveBeenCalledWith({
          devDependencies: {
            '@junk-temporary-prototypes/react': 'x.x.x',
          },
        });
        expect(executeCommandSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('latestVersion', () => {
    it('without constraint it returns the latest version', async () => {
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('"5.3.19"');

      const version = await pnpmProxy.latestVersion('@junk-temporary-prototypes/preview-api');

      expect(executeCommandSpy).toHaveBeenCalledWith('pnpm', [
        'info',
        '@junk-temporary-prototypes/preview-api',
        'version',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('with constraint it returns the latest version satisfying the constraint', async () => {
      const executeCommandSpy = jest
        .spyOn(pnpmProxy, 'executeCommand')
        .mockReturnValue('["4.25.3","5.3.19","6.0.0-beta.23"]');

      const version = await pnpmProxy.latestVersion('@junk-temporary-prototypes/preview-api', '5.X');

      expect(executeCommandSpy).toHaveBeenCalledWith('pnpm', [
        'info',
        '@junk-temporary-prototypes/preview-api',
        'versions',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('throws an error if command output is not a valid JSON', async () => {
      jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('NOT A JSON');

      await expect(pnpmProxy.latestVersion('@junk-temporary-prototypes/preview-api')).rejects.toThrow();
    });
  });

  describe('getVersion', () => {
    it('with a Storybook package listed in versions.json it returns the version', async () => {
      // eslint-disable-next-line global-require
      const storybookAngularVersion = require('../versions').default['@junk-temporary-prototypes/angular'];
      const executeCommandSpy = jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue('"5.3.19"');

      const version = await pnpmProxy.getVersion('@junk-temporary-prototypes/angular');

      expect(executeCommandSpy).toHaveBeenCalledWith('pnpm', [
        'info',
        '@junk-temporary-prototypes/angular',
        'version',
        '--json',
      ]);
      expect(version).toEqual(`^${storybookAngularVersion}`);
    });

    it('with a Storybook package not listed in versions.json it returns the latest version', async () => {
      const packageVersion = '5.3.19';
      const executeCommandSpy = jest
        .spyOn(pnpmProxy, 'executeCommand')
        .mockReturnValue(`"${packageVersion}"`);

      const version = await pnpmProxy.getVersion('@junk-temporary-prototypes/react-native');

      expect(executeCommandSpy).toHaveBeenCalledWith('pnpm', [
        'info',
        '@junk-temporary-prototypes/react-native',
        'version',
        '--json',
      ]);
      expect(version).toEqual(`^${packageVersion}`);
    });
  });

  describe('addPackageResolutions', () => {
    it('adds resolutions to package.json and account for existing resolutions', () => {
      const writePackageSpy = jest.spyOn(pnpmProxy, 'writePackageJson').mockImplementation(jest.fn);

      jest.spyOn(pnpmProxy, 'retrievePackageJson').mockImplementation(
        // @ts-expect-error (not strict)
        jest.fn(() => ({
          overrides: {
            bar: 'x.x.x',
          },
        }))
      );

      const versions = {
        foo: 'x.x.x',
      };
      pnpmProxy.addPackageResolutions(versions);

      expect(writePackageSpy).toHaveBeenCalledWith({
        overrides: {
          ...versions,
          bar: 'x.x.x',
        },
      });
    });
  });

  describe('mapDependencies', () => {
    it('should display duplicated dependencies based on pnpm output', async () => {
      // pnpm list "@junk-temporary-prototypes/*" "storybook" --depth 10 --json
      jest.spyOn(pnpmProxy, 'executeCommand').mockReturnValue(`
        [
          {
            "peerDependencies": {
              "unrelated-and-should-be-filtered": {
                "version": "1.0.0",
                "from": "",
                "resolved": ""
              }
            },
            "dependencies": {
              "@junk-temporary-prototypes/addon-interactions": {
                "from": "@junk-temporary-prototypes/addon-interactions",
                "version": "7.0.0-beta.13",
                "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/addon-interactions/-/addon-interactions-7.0.0-beta.13.tgz",
                "dependencies": {
                  "@junk-temporary-prototypes/instrumenter": {
                    "from": "@junk-temporary-prototypes/instrumenter",
                    "version": "7.0.0-beta.13",
                    "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/instrumenter/-/instrumenter-7.0.0-beta.13.tgz"
                  }
                }
              }
            },
            "devDependencies": {
              "@storybook/jest": {
                "from": "@storybook/jest",
                "version": "0.0.11-next.0",
                "resolved": "https://registry.npmjs.org/@storybook/jest/-/jest-0.0.11-next.0.tgz",
                "dependencies": {
                  "@junk-temporary-prototypes/instrumenter": {
                    "from": "@junk-temporary-prototypes/instrumenter",
                    "version": "7.0.0-rc.7",
                    "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/instrumenter/-/instrumenter-7.0.0-rc.7.tgz"
                  }
                }
              },
              "@storybook/testing-library": {
                "from": "@storybook/testing-library",
                "version": "0.0.14-next.1",
                "resolved": "https://registry.npmjs.org/@storybook/testing-library/-/testing-library-0.0.14-next.1.tgz",
                "dependencies": {
                  "@junk-temporary-prototypes/instrumenter": {
                    "from": "@junk-temporary-prototypes/instrumenter",
                    "version": "7.0.0-rc.7",
                    "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/instrumenter/-/instrumenter-7.0.0-rc.7.tgz"
                  }
                }
              },
              "@junk-temporary-prototypes/nextjs": {
                "from": "@junk-temporary-prototypes/nextjs",
                "version": "7.0.0-beta.13",
                "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/nextjs/-/nextjs-7.0.0-beta.13.tgz",
                "dependencies": {
                  "@junk-temporary-prototypes/builder-webpack5": {
                    "from": "@junk-temporary-prototypes/builder-webpack5",
                    "version": "7.0.0-beta.13",
                    "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/builder-webpack5/-/builder-webpack5-7.0.0-beta.13.tgz",
                    "dependencies": {
                      "@junk-temporary-prototypes/addons": {
                        "from": "@junk-temporary-prototypes/addons",
                        "version": "7.0.0-beta.13",
                        "resolved": "https://registry.npmjs.org/@junk-temporary-prototypes/addons/-/addons-7.0.0-beta.13.tgz"
                      }
                    }
                  }
                }
              }
            }
          }
        ]      
      `);

      const installations = await pnpmProxy.findInstallations(['@junk-temporary-prototypes/*']);

      expect(installations).toMatchInlineSnapshot(`
        Object {
          "dependencies": Object {
            "@junk-temporary-prototypes/addon-interactions": Array [
              Object {
                "location": "",
                "version": "7.0.0-beta.13",
              },
            ],
            "@junk-temporary-prototypes/addons": Array [
              Object {
                "location": "",
                "version": "7.0.0-beta.13",
              },
            ],
            "@junk-temporary-prototypes/builder-webpack5": Array [
              Object {
                "location": "",
                "version": "7.0.0-beta.13",
              },
            ],
            "@junk-temporary-prototypes/instrumenter": Array [
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
            "@junk-temporary-prototypes/nextjs": Array [
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
            "@junk-temporary-prototypes/instrumenter": Array [
              "7.0.0-rc.7",
              "7.0.0-beta.13",
            ],
          },
          "infoCommand": "pnpm list --depth=1",
        }
      `);
    });
  });
});
