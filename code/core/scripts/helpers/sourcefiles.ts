import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { dedent, prettier, getWorkspace } from '../../../../scripts/prepare/tools';

// read code/frameworks subfolders and generate a list of available frameworks
// save this list into ./code/core/src/types/frameworks.ts and export it as a union type.
// The name of the type is `SupportedFrameworks`. Add additionally 'qwik' and `solid` to that list.
export const generateSourceFiles = async () => {
  const thirdPartyFrameworks = ['qwik', 'solid'];
  const frameworksFile = join(
    import.meta.dirname,
    '..',
    'src',
    'types',
    'modules',
    'frameworks.ts'
  );
  const frameworksDirectory = join(import.meta.dirname, '..', '..', '..', 'frameworks');

  const versionsFile = join(__dirname, '..', '..', 'src', 'common', 'versions.ts');

  const [readFrameworks, workspace, prettierConfig] = await Promise.all([
    readdir(frameworksDirectory),
    getWorkspace(),
    prettier.resolveConfig(frameworksFile),
  ]);
  const frameworks = [...readFrameworks, ...thirdPartyFrameworks]
    .map((framework) => `'${framework}'`)
    .join(' | ');

  const versions = JSON.stringify(
    workspace
      .sort((a, b) => a.path.localeCompare(b.path))
      .reduce<Record<string, string>>((acc, i) => {
        if (i.publishConfig && i.publishConfig.access === 'public') {
          acc[i.name] = i.version;
        }
        return acc;
      }, {})
  );

  await Promise.all([
    Bun.write(
      frameworksFile,
      await prettier.format(
        dedent`
        // auto generated file, do not edit
        export type SupportedFrameworks = ${frameworks};
      `,
        {
          ...prettierConfig,
          parser: 'typescript',
        }
      )
    ),
    Bun.write(
      versionsFile,
      await prettier.format(
        dedent`
        // auto generated file, do not edit
        export default ${versions};
      `,
        {
          ...prettierConfig,
          parser: 'typescript',
        }
      )
    ),
  ]);
};
