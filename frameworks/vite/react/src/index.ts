/* eslint-disable global-require */
import path from 'path';
import fs from 'fs';
import type { StorybookConfig } from '@storybook/vite-tools';

export const addons: StorybookConfig['addons'] = ['@storybook/renderer-react'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export function readPackageJson(): Record<string, any> | false {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;
  plugins.push(
    require('@vitejs/plugin-react')({
      // Do not treat story files as HMR boundaries, storybook itself needs to handle them.
      exclude: [/\.stories\.([tj])sx?$/, /node_modules/],
    })
  );

  // FIXME: TS4
  // const { reactDocgen } = await presets.apply('typescript', {} as TypescriptOptions);

  // let typescriptPresent;

  // try {
  //   const pkgJson = readPackageJson();
  //   typescriptPresent =
  //     pkgJson && (pkgJson.devDependencies?.typescript || pkgJson.dependencies?.typescript);
  // } catch (e) {
  //   typescriptPresent = false;
  // }

  // FIXME: TS4
  //   if (reactDocgen === 'react-docgen-typescript' && typescriptPresent) {
  //     plugins.push(
  //       require('@joshwooding/vite-plugin-react-docgen-typescript').default(
  //         reactDocgenTypescriptOptions
  //       )
  //     );
  //   } else if (reactDocgen) {
  //     // eslint-disable-next-line no-shadow
  //     const { reactDocgen } = await import('./plugins/react-docgen');
  //     // Needs to run before the react plugin, so add to the front
  //     plugins.unshift(reactDocgen());
  //   }

  return config;
};
