import { safeResolveFrom } from '@storybook/core-common';
import { dirname } from 'path';
import dedent from 'ts-dedent';
import type { SupportedFrameworks, SupportedRenderers } from './project_types';
import { externalFrameworks } from './project_types';

export function getCliDir() {
  return dirname(require.resolve('@storybook/cli/package.json'));
}

export function getRendererDir(renderer: SupportedFrameworks | SupportedRenderers) {
  const externalFramework = externalFrameworks.find((framework) => framework.name === renderer);
  const isExternal = externalFramework?.packageName;
  const frameworkPackageName = isExternal ?? `@storybook/${renderer}`;

  const found = safeResolveFrom(process.cwd(), `${frameworkPackageName}/package.json`);

  if (found) {
    return dirname(found);
  }

  throw new Error(dedent`
    Unable to find ${frameworkPackageName}, are you sure it's installed?
  `);
}
