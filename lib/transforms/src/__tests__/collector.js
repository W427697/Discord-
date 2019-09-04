import escape from 'js-string-escape';
import { exec } from 'node-exec-promise';
import tempWrite from 'temp-write';

import { transform, createExample, createAST, formatCode } from '../__helper__/plugin-test';

import {
  detectSubConfigs,
  removeSubConfigRefs,
  getCorrectPath,
  collectSubConfigs,
  collector,
} from '../modules/collector';

describe('detectSubConfigs', () => {
  it('should detect addons & presets', async () => {
    const example = await createExample('collector/storybook.config.js');
    const ast = await createAST(example.code);

    const result = detectSubConfigs(ast);

    expect(result).toEqual(expect.arrayContaining(['./presets/a', './addons/a']));
  });
});

describe('removeSubConfigRefs', () => {
  it('remove the correct exports', async () => {
    const example = await createExample('collector/storybook.config.js');
    const { formattedCode } = await transform(example.file, removeSubConfigRefs());

    expect(formattedCode).toMatchInlineSnapshot(`
                                                "export const entries = ['*.stories.*'];
                                                "
                                `);
  });
});

describe('getCorrectPath', () => {
  it('resolves correctly', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/a';

    const result = await getCorrectPath(from, ref);

    expect(result).toContain('collector/presets/a.js');
  });
  it('throws if not found', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/missing';

    await expect(getCorrectPath(from, ref)).rejects.toThrow();
  });
});

describe('collectSubConfigs', () => {
  it('should collect from all refs in order', async () => {
    const example = await createExample('collector/storybook.config.js');

    const result = await collectSubConfigs([example.file]);

    expect(result).toEqual([
      expect.stringContaining('collector/presets/b.js'),
      expect.stringContaining('collector/presets/a.js'),
      expect.stringContaining('collector/addons/a.js'),
      expect.stringContaining('collector/storybook.config.js'),
    ]);
  });
});

describe('collector', () => {
  let result;

  const files = [
    require.resolve('../__mocks__/collector/storybook.config.js'),
    require.resolve('../__mocks__/collector/presets/a.js'),
    require.resolve('../__mocks__/collector/addons/a.js'),
    require.resolve('../__mocks__/collector/presets/b.js'),
  ];

  beforeEach(async () => {
    const output = await collector(files);
    result = formatCode(output.code);
  });

  it('should look as expected', async () => {
    expect(result).toMatchInlineSnapshot(`
                              "const _used2 = 'foo';
                              import _used from 'somewhere';
                              export const webpack = [
                                () => {
                                  // preset b
                                  console.log(_used);
                                },
                                () => {
                                  // preset a
                                  console.log(_used2);
                                },
                                () => {
                                  // addon a
                                },
                              ];
                              export const entries = [['*.stories.*']];
                              "
                    `);
  });

  it('should have collected the exports in arrays', () => {
    expect(result).toContain('export const entries = [');
    expect(result).toContain('export const webpack = [');
  });

  it('should have added scopes from subConfigs with unique ids', () => {
    expect(result).toContain(`import _used from 'somewhere`);
    expect(result).toContain(`const _used2 = 'foo';`);
  });

  it('should have removed unused vars', () => {
    expect(result).not.toContain(`unused`);
  });
});

describe('collector scope', () => {
  it('used-const', async () => {
    const output = await collector([require.resolve('../__mocks__/collector/scope/used-const')]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => {}`);
  });

  it('used-default-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-default-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used from 'somewhere'`);
  });

  it('used-named-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-named-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import { used as _used } from 'somewhere'`);
  });

  it('combined-named-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/combined-named-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import { used as _used } from 'somewhere'`);
  });

  it('combined-default-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/combined-default-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used from 'somewhere'`);
  });

  it('used-both-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-both-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used, { alsoUsed as _alsoUsed } from 'somewhere'`);
  });

  it('chained-const', async () => {
    const output = await collector([require.resolve('../__mocks__/collector/scope/chained-const')]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => _inner()`);
    expect(result).toContain(`import _inner from 'somewhere';`);
  });

  it('multi-files', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/chained-const'),
      require.resolve('../__mocks__/collector/scope/used-both-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => _inner()`);
    expect(result).toContain(`import _inner from 'somewhere';`);
    expect(result).toMatchInlineSnapshot(`
      "import _used2, { alsoUsed as _alsoUsed } from 'somewhere';
      import _inner from 'somewhere';

      const _used = () => _inner();

      export const webpack = [
        () => {
          return _used();
        },
        () => {
          return _used2(_alsoUsed());
        },
      ];
      "
    `);
  });

  it('scope imports 1', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/conflicting-import-a'),
      // require.resolve('../__mocks__/collector/scope/conflicting-import-b'),
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "import _A, {
        B as _B,
        C as _C,
        D as _D,
        E as _E,
        F as _F,
        G as _G,
        H as _H,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X = () => [_A, _B, _C, _D, _E, _F, _G, _H];

      export const webpack = [
        async () => {
          return _X;
        },
      ];
      "
    `);
  });

  it('scope imports 2', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/conflicting-import-a'),
      require.resolve('../__mocks__/collector/scope/conflicting-import-b'),
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "import _A2, {
        B as _B2,
        C as _C2,
        D as _D2,
        E as _E2,
        F as _F2,
        G as _G2,
        H as _H2,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X2 = () => [_A2, _B2, _C2, _D2, _E2, _F2, _G2, _H2];

      import _A, {
        B as _B,
        C as _C,
        D as _D,
        E as _E,
        F as _F,
        G as _G,
        H as _H,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X = () => [_A, _B, _C, _D, _E, _F, _G, _H];

      export const webpack = [
        async () => {
          return _X;
        },
        async () => {
          return _X2;
        },
      ];
      "
    `);

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });

  it('should execute result', async () => {
    const result = `
    
    const _output = {
      location: './',
      compress: false,
      preview: true // would enable/disable or set a custom location
    
    };
    import { getCacheDir as _getCacheDir3 } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/create.js";
    
    const _cacheDir3 = _getCacheDir3();
    
    import _loaders2, { css as _css2, fonts as _fonts2, media as _media2, md as _md2, mdx as _mdx2, js as _js2, mjs as _mjs2 } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/loaders.js";
    import _path3 from 'path';
    import { stats as _stats2 } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/stats.js";
    import { mapToRegex as _mapToRegex2 } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/mapToRegex.js";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/values.js";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/presets.js";
    
    const _cacheDir2 = _getCacheDir2();
    
    import _loaders, { css as _css, fonts as _fonts, media as _media, md as _md, mdx as _mdx, js as _js, mjs as _mjs } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/loaders.js";
    import _path2 from 'path';
    import { getCacheDir as _getCacheDir2, getCoreDir as _getCoreDir } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/create.js";
    
    const _coreDir = _getCoreDir();
    
    import { stats as _stats } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/stats.js";
    import { mapToRegex as _mapToRegex } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/mapToRegex.js";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/values.js";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/presets.js";
    import { getCacheDir as _getCacheDir } from "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/paths.js";
    
    const _cacheDir = _getCacheDir();
    
    import _path from 'path';
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/src/types/values.ts";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/values.js";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/src/types/values.ts";
    import "/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/types/values.js";
    export const entries = [[], ['**/*.stories.[t|j]s']];
    export const logLevel = ['info', 'info'];
    export const server = [{
      port: 5000,
      devPorts: {
        manager: 55550,
        preview: 55551
      },
      host: 'localhost',
      middleware: [],
      static: []
    }, {
      port: 1337,
      host: 'localhost',
      devPorts: {
        manager: 55550,
        preview: 55551
      } // static: {
      //   '/': 'assets',
      // },
      // ssl: {
      //   ca: [],
      //   cert: '',
      //   key: '',
      // },
      // middleware: async (app, server) => {},
    
    }, base => ({ ...base,
      port: 9011 || base.port,
      host: undefined || base.host,
      static: (base.static || []).concat(["built-storybooks"])
    })];
    export const output = [{
      compress: false,
      location: _path.join(_cacheDir, 'out'),
      preview: true
    }, {
      location: './',
      compress: false,
      preview: true
    }];
    export const managerWebpack = [async (_, config) => {
      const {
        default: HtmlWebpackPlugin
      } = await import("/Users/dev/Projects/GitHub/storybook/core/node_modules/html-webpack-plugin/index.js");
      const {
        default: CaseSensitivePathsPlugin
      } = await import("/Users/dev/Projects/GitHub/storybook/core/node_modules/case-sensitive-paths-webpack-plugin/index.js");
      const {
        create
      } = await import("/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/entrypointsPlugin.js");
      const {
        location
      } = await config.output;
      const e = await config.entries;
      const {
        entries: entry,
        plugin
      } = create(e, {});
      const entryRegex = e.map(_mapToRegex);
      return {
        name: 'manager',
        mode: 'development',
        bail: true,
        devtool: false,
        stats: _stats,
        entry: {
          main: [\`\${_coreDir}/client/manager/index.js\`],
          ...Object.entries((await entry())).reduce((acc, [k, v]) => ({ ...acc,
            [k.replace('preview', 'metadata')]: v
          }), {})
        },
        output: {
          path: location,
          filename: '[name].[hash].bundle.js',
          publicPath: ''
        },
        plugins: [new HtmlWebpackPlugin({
          filename: \`index.html\`,
          chunksSortMode: () => 0,
          alwaysWriteToDisk: true,
          inject: false,
          templateParameters: (compilation, files, templateOptions) => ({
            compilation,
            files,
            options: templateOptions,
            version: 1,
            dlls: [],
            headHtmlSnippet: '',
            mains: files.js.filter(i => !i.includes('metadata')),
            examples: files.js.filter(i => i.includes('metadata'))
          }),
          template: _path2.join(__dirname, '..', 'templates', 'index.ejs')
        }), new CaseSensitivePathsPlugin(), plugin],
        module: {
          rules: [{
            test: entryRegex,
            loader: _loaders.managerEntry,
            exclude: [/node_modules/, /dist/],
            options: {
              storybook: true
            }
          }, _css, _md, _fonts, _media, { ..._mdx,
            exclude: [...entryRegex, /node_modules/, /dist/]
          }, { ..._js,
            exclude: [...entryRegex, /node_modules/, /dist/]
          }, { ..._mjs,
            exclude: [...entryRegex, /dist/]
          }]
        },
        resolve: {
          extensions: ['.mjs', '.js', '.jsx', '.json'],
          modules: ['node_modules']
        },
        recordsPath: _path2.join(_cacheDir2, 'records.json'),
        optimization: {
          splitChunks: {
            chunks: 'all'
          },
          runtimeChunk: {
            name: 'manager-runtime'
          }
        }
      };
    }, async base => {
      const {
        default: webpackMerge
      } = await import("/Users/dev/Projects/GitHub/storybook/core/node_modules/webpack-merge/lib/index.js");
      const output = webpackMerge(base, {
        resolve: {
          mainFields: ['browser', 'module', 'main']
        }
      });
      return output;
    }];
    export const webpack = [async (_, config) => {
      const {
        default: HtmlWebpackPlugin
      } = await import("/Users/dev/Projects/GitHub/storybook/core/node_modules/html-webpack-plugin/index.js");
      const {
        default: CaseSensitivePathsPlugin
      } = await import("/Users/dev/Projects/GitHub/storybook/core/node_modules/case-sensitive-paths-webpack-plugin/index.js");
      const {
        create
      } = await import("/Users/dev/Projects/GitHub/storybook/core/lib/config/dist/utils/entrypointsPlugin.js");
      const {
        location
      } = await config.output;
      const e = await config.entries;
      const {
        entries: entry,
        plugin
      } = create(e, {});
      const entryRegex = e.map(_mapToRegex2);
      return {
        name: 'preview',
        mode: 'development',
        bail: true,
        devtool: false,
        stats: _stats2,
        entry: await entry(),
        output: {
          path: location,
          filename: '[name].[hash].bundle.js',
          publicPath: ''
        },
        plugins: [new HtmlWebpackPlugin({
          filename: \`iframe.html\`,
          chunksSortMode: () => 0,
          alwaysWriteToDisk: true,
          inject: false,
          templateParameters: (compilation, files, templateOptions) => ({
            compilation,
            files,
            options: templateOptions,
            version: 1,
            dlls: [],
            headHtmlSnippet: '',
            mains: files.js.filter(i => !i.includes('preview')),
            examples: files.js.filter(i => i.includes('preview'))
          }),
          template: _path3.join(__dirname, '..', 'templates', 'index.ejs')
        }), new CaseSensitivePathsPlugin(), plugin],
        module: {
          rules: [{
            test: e.map(_mapToRegex2),
            loader: _loaders2.previewEntry,
            exclude: /node_modules/,
            options: {
              storybook: true
            }
          }, _css2, _md2, _fonts2, _media2, { ..._mdx2,
            exclude: [...entryRegex, /node_modules/]
          }, _js2, { ..._mjs2,
            exclude: [...entryRegex]
          }]
        },
        resolve: {
          extensions: ['.mjs', '.js', '.jsx', '.json'],
          modules: ['node_modules']
        },
        recordsPath: _path3.join(_cacheDir3, 'records.json'),
        optimization: {
          splitChunks: {
            chunks: 'all'
          },
          runtimeChunk: {
            name: 'preview-runtime'
          }
        }
      };
    }];
    export const meaningless = [42];
    export const theme = [{}];
    export const presets = [[]];
    export const addons = [[]];

    `;

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });
});
