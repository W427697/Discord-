import { dirname, join } from 'path';
import fs from 'fs-extra';

import { render } from 'ejs';

import type { DocsOptions, TagsOptions, Options, Ref } from '@storybook/core/dist/types';

export const getTemplatePath = async (template: string) => {
  return join(
    dirname(require.resolve('@storybook/builder-manager/package.json')),
    'templates',
    template
  );
};

export const readTemplate = async (template: string) => {
  const path = await getTemplatePath(template);

  return fs.readFile(path, 'utf8');
};

export async function getManagerMainTemplate() {
  return getTemplatePath(`manager.ejs`);
}

export const renderHTML = async (
  template: Promise<string>,
  title: Promise<string | false>,
  favicon: Promise<string>,
  customHead: Promise<string | false>,
  cssFiles: string[],
  jsFiles: string[],
  features: Promise<Record<string, any>>,
  refs: Promise<Record<string, Ref>>,
  logLevel: Promise<string>,
  docsOptions: Promise<DocsOptions>,
  tagsOptions: Promise<TagsOptions>,
  { versionCheck, previewUrl, configType, ignorePreview }: Options,
  globals: Record<string, any>
) => {
  const titleRef = await title;
  const templateRef = await template;
  const stringifiedGlobals = Object.entries(globals).reduce(
    (transformed, [key, value]) => ({ ...transformed, [key]: JSON.stringify(value) }),
    {}
  );

  return render(templateRef, {
    title: titleRef ? `${titleRef} - Storybook` : 'Storybook',
    files: { js: jsFiles, css: cssFiles },
    favicon: await favicon,
    globals: {
      FEATURES: JSON.stringify(await features, null, 2),
      REFS: JSON.stringify(await refs, null, 2),
      LOGLEVEL: JSON.stringify(await logLevel, null, 2),
      DOCS_OPTIONS: JSON.stringify(await docsOptions, null, 2),
      CONFIG_TYPE: JSON.stringify(await configType, null, 2),
      // These two need to be double stringified because the UI expects a string
      VERSIONCHECK: JSON.stringify(JSON.stringify(versionCheck), null, 2),
      PREVIEW_URL: JSON.stringify(previewUrl, null, 2), // global preview URL
      TAGS_OPTIONS: JSON.stringify(await tagsOptions, null, 2),
      ...stringifiedGlobals,
    },
    head: (await customHead) || '',
    ignorePreview,
  });
};
