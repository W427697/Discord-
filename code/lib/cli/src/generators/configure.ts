import fse from 'fs-extra';
import { dedent } from 'ts-dedent';
import { SupportedLanguage } from '../project_types';

interface ConfigureMainOptions {
  addons: string[];
  extensions?: string[];
  commonJs?: boolean;
  staticDirs?: string[];
  storybookConfigFolder: string;
  /**
   * Extra values for main.js
   *
   * In order to provide non-serializable data like functions, you can use
   * { value: '%%yourFunctionCall()%%' }
   *
   * '%% and %%' will be replaced.
   *
   */
  [key: string]: any;
}

export interface FrameworkPreviewParts {
  prefix: string;
}

interface ConfigurePreviewOptions {
  frameworkPreviewParts?: FrameworkPreviewParts;
  storybookConfigFolder: string;
}

export async function configureMain({
  addons,
  extensions = ['js', 'jsx', 'ts', 'tsx'],
  commonJs = false,
  storybookConfigFolder,
  language,
  ...custom
}: ConfigureMainOptions) {
  const prefix = (await fse.pathExists('./src')) ? '../src' : '../stories';
  const config = {
    stories: [`${prefix}/**/*.mdx`, `${prefix}/**/*.stories.@(${extensions.join('|')})`],
    addons,
    ...custom,
  };

  const isTypescript =
    language === SupportedLanguage.TYPESCRIPT || language === SupportedLanguage.TYPESCRIPT_LEGACY;

  const tsTemplate = dedent`<<import>>const config<<type>> = <<mainContents>>;
  export default config;`;

  const jsTemplate = dedent`const config = <<mainContents>>
  export default config;`;

  const finalTemplate = isTypescript ? tsTemplate : jsTemplate;

  const mainJsContents = finalTemplate
    .replace('<<import>>', `import { StorybookConfig } from '${custom.framework.name}';\n\n`)
    .replace('<<type>>', ': StorybookConfig')
    .replace('<<mainContents>>', JSON.stringify(config, null, 2));

  await fse.writeFile(
    `./${storybookConfigFolder}/main.${isTypescript ? 'ts' : 'js'}`,
    dedent`
      ${mainJsContents}
    `,
    { encoding: 'utf8' }
  );
}

export async function configurePreview(options: ConfigurePreviewOptions) {
  const { prefix = '' } = options?.frameworkPreviewParts || {};
  const previewPath = `./${options.storybookConfigFolder}/preview.js`;

  // If the framework template included a preview then we have nothing to do
  if (await fse.pathExists(previewPath)) {
    return;
  }

  const preview = dedent`
    ${prefix}
    export const parameters = {
      actions: { argTypesRegex: "^on[A-Z].*" },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/,
        },
      },
    }`
    .replace('  \n', '')
    .trim();

  await fse.writeFile(previewPath, preview, { encoding: 'utf8' });
}
