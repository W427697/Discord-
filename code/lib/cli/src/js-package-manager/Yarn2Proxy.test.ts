import { Yarn2Proxy } from './Yarn2Proxy';

describe('Yarn 2 Proxy', () => {
  let yarn2Proxy: Yarn2Proxy;

  beforeEach(() => {
    yarn2Proxy = new Yarn2Proxy();
  });

  it('type should be yarn2', () => {
    expect(yarn2Proxy.type).toEqual('yarn2');
  });

  describe('initPackageJson', () => {
    it('should run `yarn init`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('');

      yarn2Proxy.initPackageJson();

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', ['init']);
    });
  });

  describe('installDependencies', () => {
    it('should run `yarn`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('');

      yarn2Proxy.installDependencies();

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', ['install'], expect.any(String));
    });
  });

  describe('runScript', () => {
    it('should execute script `yarn compodoc -- -e json -d .`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('7.1.0');

      yarn2Proxy.runPackageCommand('compodoc', ['-e', 'json', '-d', '.']);

      expect(executeCommandSpy).toHaveBeenLastCalledWith(
        'yarn',
        ['compodoc', '-e', 'json', '-d', '.'],
        undefined,
        undefined
      );
    });
  });

  describe('setRegistryUrl', () => {
    it('should run `yarn config set npmRegistryServer https://foo.bar`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('');

      yarn2Proxy.setRegistryURL('https://foo.bar');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'config',
        'set',
        'registry',
        'https://foo.bar',
      ]);
    });
  });

  describe('addDependencies', () => {
    it('with devDep it should run `yarn install -D @junk-temporary-prototypes/preview-api`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('');

      yarn2Proxy.addDependencies({ installAsDevDependencies: true }, ['@junk-temporary-prototypes/preview-api']);

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'yarn',
        ['add', '-D', '@junk-temporary-prototypes/preview-api'],
        expect.any(String)
      );
    });
  });

  describe('removeDependencies', () => {
    it('should run `yarn remove @junk-temporary-prototypes/preview-api`', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('');

      yarn2Proxy.removeDependencies({}, ['@junk-temporary-prototypes/preview-api']);

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'yarn',
        ['remove', '@junk-temporary-prototypes/preview-api'],
        expect.any(String)
      );
    });

    it('skipInstall should only change package.json without running install', () => {
      const executeCommandSpy = jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('7.0.0');
      const writePackageSpy = jest
        .spyOn(yarn2Proxy, 'writePackageJson')
        .mockImplementation(jest.fn);

      yarn2Proxy.removeDependencies(
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

  describe('latestVersion', () => {
    it('without constraint it returns the latest version', async () => {
      const executeCommandSpy = jest
        .spyOn(yarn2Proxy, 'executeCommand')
        .mockReturnValue('{"name":"@junk-temporary-prototypes/preview-api","version":"5.3.19"}');

      const version = await yarn2Proxy.latestVersion('@junk-temporary-prototypes/preview-api');

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', [
        'npm',
        'info',
        '@junk-temporary-prototypes/preview-api',
        '--fields',
        'version',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('with constraint it returns the latest version satisfying the constraint', async () => {
      const executeCommandSpy = jest
        .spyOn(yarn2Proxy, 'executeCommand')
        .mockReturnValue(
          '{"name":"@junk-temporary-prototypes/preview-api","versions":["4.25.3","5.3.19","6.0.0-beta.23"]}'
        );

      const version = await yarn2Proxy.latestVersion('@junk-temporary-prototypes/preview-api', '5.X');

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', [
        'npm',
        'info',
        '@junk-temporary-prototypes/preview-api',
        '--fields',
        'versions',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('throws an error if command output is not a valid JSON', async () => {
      jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue('NOT A JSON');

      await expect(yarn2Proxy.latestVersion('@junk-temporary-prototypes/preview-api')).rejects.toThrow();
    });
  });

  describe('addPackageResolutions', () => {
    it('adds resolutions to package.json and account for existing resolutions', () => {
      const writePackageSpy = jest
        .spyOn(yarn2Proxy, 'writePackageJson')
        .mockImplementation(jest.fn);

      jest.spyOn(yarn2Proxy, 'retrievePackageJson').mockImplementation(
        jest.fn(() => ({
          dependencies: {},
          devDependencies: {},
          resolutions: {
            bar: 'x.x.x',
          },
        }))
      );

      const versions = {
        foo: 'x.x.x',
      };
      yarn2Proxy.addPackageResolutions(versions);

      expect(writePackageSpy).toHaveBeenCalledWith({
        dependencies: {},
        devDependencies: {},
        resolutions: {
          ...versions,
          bar: 'x.x.x',
        },
      });
    });
  });

  describe('mapDependencies', () => {
    it('should display duplicated dependencies based on yarn2 output', async () => {
      // yarn info --name-only --recursive "@junk-temporary-prototypes/*" "storybook"
      jest.spyOn(yarn2Proxy, 'executeCommand').mockReturnValue(`
      "unrelated-and-should-be-filtered@npm:1.0.0"
      "@storybook/global@npm:5.0.0"
      "@junk-temporary-prototypes/instrumenter@npm:7.0.0-beta.12"
      "@junk-temporary-prototypes/instrumenter@npm:7.0.0-beta.19"
      "@storybook/jest@npm:0.0.11-next.0"
      "@junk-temporary-prototypes/manager-api@npm:7.0.0-beta.19"
      "@junk-temporary-prototypes/manager@npm:7.0.0-beta.19"
      "@storybook/mdx2-csf@npm:0.1.0-next.5"
      `);

      const installations = await yarn2Proxy.findInstallations(['@junk-temporary-prototypes/*']);

      expect(installations).toMatchInlineSnapshot(`
        Object {
          "dependencies": Object {
            "@storybook/global": Array [
              Object {
                "location": "",
                "version": "5.0.0",
              },
            ],
            "@junk-temporary-prototypes/instrumenter": Array [
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
            "@junk-temporary-prototypes/manager": Array [
              Object {
                "location": "",
                "version": "7.0.0-beta.19",
              },
            ],
            "@junk-temporary-prototypes/manager-api": Array [
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
            "@junk-temporary-prototypes/instrumenter": Array [
              "7.0.0-beta.12",
              "7.0.0-beta.19",
            ],
          },
          "infoCommand": "yarn why",
        }
      `);
    });
  });
});
