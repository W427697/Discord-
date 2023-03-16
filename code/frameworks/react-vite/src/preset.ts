/* eslint-disable global-require */
import type { PresetProperty } from '@storybook/types';
import { hasVitePlugins } from '@storybook/builder-vite';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
  renderer: wrapForPnP('@storybook/react'),
};

function getFastRefresh(isDevelopment: boolean, framework: unknown): boolean | undefined {
  if (!isDevelopment) return false;

  const fastRefresh: boolean | undefined =
    framework != null &&
    typeof framework === 'object' &&
    'options' in framework &&
    framework.options != null &&
    typeof framework.options === 'object' &&
    'fastRefresh' in framework.options &&
    typeof framework.options.fastRefresh === 'boolean'
      ? framework.options.fastRefresh
      : undefined;

  if (typeof fastRefresh === 'boolean') return fastRefresh;
  if (process.env.FAST_REFRESH === 'true') return true;
  if (process.env.FAST_REFRESH === 'false') return false;

  return undefined;
}

export const viteFinal: StorybookConfig['viteFinal'] = async (config, options) => {
  const { presets } = options;
  const { plugins = [] } = config;

  // Add react plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:react-babel', 'vite:react-swc']))) {
    const { default: react } = await import('@vitejs/plugin-react');

    const framework = await presets.apply('framework');

    plugins.push(
      react({
        fastRefresh: getFastRefresh(options.configType === 'DEVELOPMENT', framework),
      })
    );
  }

  // Add docgen plugin
  const { reactDocgen: reactDocgenOption, reactDocgenTypescriptOptions } = await presets.apply<any>(
    'typescript',
    {}
  );
  let typescriptPresent;

  try {
    require.resolve('typescript');
    typescriptPresent = true;
  } catch (e) {
    typescriptPresent = false;
  }

  if (reactDocgenOption === 'react-docgen-typescript' && typescriptPresent) {
    plugins.push(
      require('@joshwooding/vite-plugin-react-docgen-typescript')({
        ...reactDocgenTypescriptOptions,
        // We *need* this set so that RDT returns default values in the same format as react-docgen
        savePropValueAsString: true,
      })
    );
  }

  // Add react-docgen so long as the option is not false
  if (typeof reactDocgenOption === 'string') {
    const { reactDocgen } = await import('./plugins/react-docgen');
    // Needs to run before the react plugin, so add to the front
    plugins.unshift(
      // If react-docgen is specified, use it for everything, otherwise only use it for non-typescript files
      reactDocgen({
        include: reactDocgenOption === 'react-docgen' ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
      })
    );
  }

  return config;
};
