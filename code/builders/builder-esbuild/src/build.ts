import type { CoreConfig, DocsOptions, Options, PreviewAnnotation } from '@storybook/types';
import type { BuildOptions } from 'esbuild';
import {
  handlebars,
  isPreservingSymlinks,
  loadPreviewOrConfigFile,
  normalizeStories,
  readTemplate,
  stringifyProcessEnvs,
} from '@storybook/core-common';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import globalsPlugin from '@fal-works/esbuild-plugin-global-externals';
import aliasPlugin from 'esbuild-plugin-alias';

import path, { join, resolve, dirname } from 'path';
import slash from 'slash';
import { globalsModuleInfoMap } from '@storybook/preview/globals-module-info';
import { toImportFn } from './toImportFn';
import { virtualModulePlugin } from './plugins/virtualModulePlugin';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;
const maybeGetAbsolutePath = <I extends string>(input: I): I | false => {
  try {
    return getAbsolutePath(input);
  } catch (e) {
    return false;
  }
};

const managerAPIPath = maybeGetAbsolutePath(`@storybook/manager-api`);
const componentsPath = maybeGetAbsolutePath(`@storybook/components`);
const globalPath = maybeGetAbsolutePath(`@storybook/global`);
const routerPath = maybeGetAbsolutePath(`@storybook/router`);
const themingPath = maybeGetAbsolutePath(`@storybook/theming`);

const storybookPaths: Record<string, string> = {
  ...(managerAPIPath
    ? {
        // deprecated, remove in 8.0
        [`@storybook/api`]: managerAPIPath,
        [`@storybook/manager-api`]: managerAPIPath,
      }
    : {}),
  ...(componentsPath ? { [`@storybook/components`]: componentsPath } : {}),
  ...(globalPath ? { [`@storybook/global`]: globalPath } : {}),
  ...(routerPath ? { [`@storybook/router`]: routerPath } : {}),
  ...(themingPath ? { [`@storybook/theming`]: themingPath } : {}),
};

export async function getOptions(options: Options): Promise<BuildOptions> {
  const {
    presets,
    configType,
    packageJson,
    features,
    previewUrl,
    outputDir = join('.', 'public'),
  } = options;
  const workingDir = process.cwd();
  const projectRoot = path.resolve(options.configDir, '..');

  const [
    entries,
    nonNormalizedStories,
    envs,
    template,
    loglevel,
    frameworkOptions,
    coreOptions,
    docsOptions,
    headHtmlSnippet,
    bodyHtmlSnippet,
  ] = await Promise.all([
    presets.apply<string[]>('entries', []),
    presets.apply('stories', []),
    presets.apply<Record<string, string>>('env', {}),
    presets.apply<string>('previewMainTemplate'),
    presets.apply('logLevel', undefined),
    presets.apply('frameworkOptions'),
    presets.apply<CoreConfig>('core'),
    presets.apply<DocsOptions>('docs'),
    presets.apply<string>('previewHead'),
    presets.apply<string>('previewBody'),
  ]);

  const storiesFilename = 'storybook-stories.js';
  const storiesPath = `./${storiesFilename}`;
  const isProd = configType === 'PRODUCTION';

  const stories = normalizeStories(nonNormalizedStories, {
    configDir: options.configDir,
    workingDir,
  });

  const previewAnnotations = [
    ...(await presets.apply<PreviewAnnotation[]>('previewAnnotations', [], options)).map(
      (entry) => {
        // If entry is an object, use the absolute import specifier.
        // This is to maintain back-compat with community addons that bundle other addons
        // and package managers that "hide" sub dependencies (e.g. pnpm / yarn pnp)
        // The vite builder uses the bare import specifier.
        if (typeof entry === 'object') {
          return entry.absolute;
        }

        return slash(entry);
      }
    ),
    loadPreviewOrConfigFile(options),
  ].filter(Boolean);

  const virtualModuleMapping: Record<string, string> = {};

  virtualModuleMapping[storiesPath] = toImportFn(stories);
  const configEntryPath = resolve(join(workingDir, 'storybook-config-entry.js'));
  virtualModuleMapping[configEntryPath] = handlebars(
    await readTemplate(
      require.resolve('@storybook/builder-esbuild/templates/virtualModuleModernEntry.js.handlebars')
    ),
    {
      storiesFilename,
      previewAnnotations,
    }
    // We need to double escape `\` for webpack. We may have some in windows paths
  ).replace(/\\/g, '\\\\');
  entries.push(configEntryPath);

  return {
    entryPoints: entries,
    outdir: outputDir,
    chunkNames: isProd ? '[name].[hash].chunk.iframe.bundle.js' : '[name].iframe.bundle.js',
    entryNames: isProd ? '[name].[hash].iframe.bundle.js' : '[name].iframe.bundle.js',
    bundle: true,
    minify: true,
    splitting: true,
    alias: storybookPaths,
    sourcemap: !isProd ? 'inline' : false,
    define: {
      ...stringifyProcessEnvs(envs),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      global: 'window',
    },
    sourceRoot: projectRoot,
    preserveSymlinks: isPreservingSymlinks(),
    resolveExtensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
    platform: 'browser',
    target: ['chrome100', 'safari15', 'firefox91'],
    conditions: ['browser', 'module', 'default'],
    format: 'esm',
    metafile: true,
    plugins: [
      virtualModulePlugin(virtualModuleMapping),
      globalsPlugin(globalsModuleInfoMap),
      aliasPlugin({
        process: require.resolve('process/browser.js'),
        util: require.resolve('util/util.js'),
        assert: require.resolve('browser-assert'),
      }),
      htmlPlugin({
        files: [
          {
            entryPoints: entries.map((entry) => {
              if (virtualModuleMapping[entry]) {
                return `virtual-module:${entry}`;
              }
              return entry;
            }),
            filename: 'iframe.html',
            htmlTemplate: template,
            hash: true,
            scriptLoading: 'module',
            define: {
              version: packageJson.version ?? '',
              headHtmlSnippet: headHtmlSnippet ?? '',
              bodyHtmlSnippet: bodyHtmlSnippet ?? '',
              globals: JSON.stringify({
                CONFIG_TYPE: configType,
                LOGLEVEL: loglevel,
                FRAMEWORK_OPTIONS: frameworkOptions,
                CHANNEL_OPTIONS: coreOptions.channelOptions,
                FEATURES: features,
                PREVIEW_URL: previewUrl,
                STORIES: stories.map((specifier) => {
                  return {
                    ...specifier,
                    importPathMatcher: specifier.importPathMatcher.source.replaceAll(
                      '\\',
                      '%%BS%%'
                    ),
                  };
                }),
                DOCS_OPTIONS: docsOptions,
              }),
            },
            findRelatedCssFiles: true,
          },
        ],
      }),
    ],
    // TODO: React specific
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    jsx: 'transform',
    jsxImportSource: 'react',
    legalComments: 'external',
    loader: {
      '.js': 'jsx',
      '.png': 'file',
      '.svg': 'file',
      '.avif': 'file',
    },
  };
}
