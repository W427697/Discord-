import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';
import type { StorybookConfig } from '@storybook/types';
import type { JsPackageManager } from '@storybook/core-common';
import { webpack5CompilerSetup } from './webpack5-compiler-setup';
import { CoreWebpackCompilers } from '../../project_types';

const check = async ({
  packageManager,
  mainConfig,
  storybookVersion = '8.0.0',
}: {
  packageManager?: Partial<JsPackageManager>;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
  mainConfig?: Partial<StorybookConfig>;
}) => {
  return webpack5CompilerSetup.check({
    packageManager: packageManager as any,
    configDir: '',
    storybookVersion,
    mainConfig: mainConfig as any,
  });
};

const promptMocks = vi.hoisted(() => {
  return {
    default: vi.fn(),
  };
});

vi.mock('prompts', () => {
  return {
    default: promptMocks.default,
  };
});

// mock chalk yellow and cyan
vi.mock('chalk', () => {
  return {
    default: {
      yellow: (str: string) => str,
      cyan: (str: string) => str,
    },
  };
});

describe('check function', () => {
  describe('webpack5Migration check function', () => {
    beforeEach(() => {
      promptMocks.default.mockResolvedValue({
        compiler: 'swc',
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    describe('return null', async () => {
      it('should return null if the builder is not webpack5', async () => {
        const result = check({
          mainConfig: {
            framework: {
              name: '@storybook/react-vite',
            },
          },
        });

        await expect(result).resolves.toBeNull();
      });

      it('should return null if the framework is Angular', async () => {
        const result = check({
          mainConfig: {
            framework: '@storybook/angular',
          },
        });

        await expect(result).resolves.toBeNull();
        // ...
      });

      it('should return null if the framework is Ember', async () => {
        const result = check({
          mainConfig: {
            framework: {
              name: '@storybook/ember',
            },
          },
        });

        await expect(result).resolves.toBeNull();
      });

      it('should return null if the framework is Webpack5 based but a different framework builder is used', async () => {
        const result = check({
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
              options: {
                builder: '@storybook/builder-vite',
              },
            },
          },
        });

        await expect(result).resolves.toBeNull();
      });

      it('should return null if the framework is Webpack5 based but a different core builder is used', async () => {
        const result = check({
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
            },
            core: {
              builder: '@storybook/builder-vite',
            },
          },
        });

        await expect(result).resolves.toBeNull();
      });

      it('should return null if the framework is CRA based', async () => {
        const result = check({
          packageManager: {
            getPackageVersion: (name) => {
              if (name === 'react-scripts') {
                return Promise.resolve('5.0.0');
              }

              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
            },
          },
        });

        await expect(result).resolves.toBeNull();
      });
    });

    describe('useSWC', () => {
      it('should return shouldRemoveSWCFlag: true when useSWC flag is set to true', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
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
        });

        expect(result).contains({
          shouldRemoveSWCFlag: true,
        });
      });

      it('should return shouldRemoveSWCFlag: true when useSWC flag is set to false', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
              options: {
                builder: {
                  useSWC: false,
                },
              },
            },
          },
        });

        expect(result).contains({
          shouldRemoveSWCFlag: true,
        });
      });

      it('should return shouldRemoveSWCFlag: false when useSWC flag is not set', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
              options: {
                builder: {},
              },
            },
          },
        });

        expect(result).contains({
          shouldRemoveSWCFlag: false,
        });
      });
    });

    describe('Next.js', () => {
      it('should return isNextJs: true when the framework is nextjs', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/nextjs',
            },
          },
        });

        expect(result).contains({
          isNextJs: true,
        });
      });

      it('should return isNextJs: true AND should return shouldRemoveSWCFlag: true when useSWC flag is set', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/nextjs',
              options: {
                builder: {
                  useSWC: true,
                },
              },
            },
          },
        });

        expect(result).contains({
          shouldRemoveSWCFlag: true,
          isNextJs: true,
        });
      });

      it('should return isNextJs: false when the framework is not nextjs', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
            },
          },
        });

        expect(result).contains({
          isNextJs: false,
        });
      });
    });

    describe('return options', () => {
      it('should return compiler: babel when useSWC flag is not set and the user selects babel during prompt', async () => {
        promptMocks.default.mockResolvedValue({
          compiler: 'babel',
        });

        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/react-webpack5',
            },
          },
        });

        expect(result).contains({
          compiler: 'babel',
          compilerPackageName: '@storybook/addon-webpack5-compiler-babel',
        });
      });

      describe('user selects swc', () => {
        it('should return compiler: swc when useSWC flag is not set and the user selects swc during prompt', async () => {
          promptMocks.default.mockResolvedValue({
            compiler: 'swc',
          });

          const result = await check({
            packageManager: {
              getPackageVersion: (name) => {
                return Promise.resolve(null);
              },
            },
            mainConfig: {
              framework: {
                name: '@storybook/react-webpack5',
              },
            },
          });

          expect(result).contains({
            compiler: 'swc',
            compilerPackageName: '@storybook/addon-webpack5-compiler-swc',
          });
        });
      });

      it('should return compiler: swc when useSWC flag is set', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              return Promise.resolve(null);
            },
          },
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
        });

        expect(result).contains({
          compiler: 'swc',
          compilerPackageName: '@storybook/addon-webpack5-compiler-swc',
        });
      });

      it('should return options if the framework is unknown but webpack5 was detected', async () => {
        const result = await check({
          packageManager: {
            getPackageVersion: (name) => {
              if (name === 'webpack') {
                return Promise.resolve('5.0.0');
              }

              return Promise.resolve(null);
            },
          },
          mainConfig: {
            framework: {
              name: '@storybook/unknown',
            },
          },
        });

        expect(result).not.toBeNull();
      });
    });
  });

  describe('prompt', () => {
    it('shouldRemoveSWCFlag = true', async () => {
      const prompt = webpack5CompilerSetup.prompt({
        shouldRemoveSWCFlag: true,
        isNextJs: false,
        compilerPackageName: '@storybook/addon-webpack5-compiler-swc',
        compiler: CoreWebpackCompilers.SWC,
      });

      expect(prompt).toMatchInlineSnapshot(`
          "We need to update your Storybook configuration for Webpack 5.
          The framework.options.builder.useSWC flag will be removed.

          The @storybook/addon-webpack5-compiler-swc addon will be added to your project. It adds SWC as the compiler for your Storybook.
          After the migration, you can switch Webpack5 compilers by swapping the addon in your project.
          You can find more information here: https://storybook.js.org/docs/8.0/builders/webpack#compiler-support"
        `);
    });

    it('shouldRemoveSWCFlag = false', async () => {
      const prompt = webpack5CompilerSetup.prompt({
        shouldRemoveSWCFlag: false,
        isNextJs: false,
        compilerPackageName: '@storybook/addon-webpack5-compiler-swc',
        compiler: CoreWebpackCompilers.SWC,
      });

      expect(prompt).toMatchInlineSnapshot(`
        "The @storybook/addon-webpack5-compiler-swc addon will be added to your project. It adds SWC as the compiler for your Storybook.
        After the migration, you can switch Webpack5 compilers by swapping the addon in your project.
        You can find more information here: https://storybook.js.org/docs/8.0/builders/webpack#compiler-support"
      `);
    });

    it('isNextJs = true', () => {
      const prompt = webpack5CompilerSetup.prompt({
        shouldRemoveSWCFlag: true,
        isNextJs: true,
        compilerPackageName: undefined,
        compiler: undefined,
      });

      expect(prompt).toMatchInlineSnapshot(`
        "We need to update your Storybook configuration for Webpack 5.
        The framework.options.builder.useSWC flag will be removed.

        Storybook now detects whether it should use Babel or SWC as a compiler by applying the same logic as Next.js itself:

          - If you have a babel.config.js file in your project, Storybook will use Babel as the compiler.
          - If you have a babel.config.js file in your project and you have set 
            experimental.forceSwcTransforms = true in your next.config.js file, 
            Storybook will use SWC as the compiler.
          - If you don't have a babel.config.js file in your project, Storybook will use SWC as the compiler."
      `);
    });

    it('isNextjs = false AND compilerPackageName = @storybook/addon-webpack5-compiler-swc AND compiler = swc', () => {
      const prompt = webpack5CompilerSetup.prompt({
        shouldRemoveSWCFlag: false,
        isNextJs: false,
        compilerPackageName: '@storybook/addon-webpack5-compiler-swc',
        compiler: CoreWebpackCompilers.SWC,
      });

      expect(prompt).toMatchInlineSnapshot(`
        "The @storybook/addon-webpack5-compiler-swc addon will be added to your project. It adds SWC as the compiler for your Storybook.
        After the migration, you can switch Webpack5 compilers by swapping the addon in your project.
        You can find more information here: https://storybook.js.org/docs/8.0/builders/webpack#compiler-support"
      `);
    });

    it('isNextjs = false AND compilerPackageName = @storybook/addon-webpack5-compiler-babel AND compiler = babel', () => {
      const prompt = webpack5CompilerSetup.prompt({
        shouldRemoveSWCFlag: false,
        isNextJs: false,
        compilerPackageName: '@storybook/addon-webpack5-compiler-babel',
        compiler: CoreWebpackCompilers.Babel,
      });

      expect(prompt).toMatchInlineSnapshot(`
        "The @storybook/addon-webpack5-compiler-babel addon will be added to your project. It adds Babel as the compiler for your Storybook.
        After the migration, you can switch Webpack5 compilers by swapping the addon in your project.
        You can find more information here: https://storybook.js.org/docs/8.0/builders/webpack#compiler-support"
      `);
    });
  });
});
