import dedent from 'ts-dedent';

export function getTypeScriptTemplateForNewStoryFile(data: {
  /** The components file name without the extension */
  basename: string;
  componentExportName: string;
  default: boolean;
  /** The framework package name, e.g. @storybook/nextjs */
  frameworkPackageName: string;
  /** The exported name of the default story */
  exportedStoryName: string;
}) {
  const importName = data.default ? 'Component' : data.componentExportName;
  const importStatement = data.default
    ? `import ${importName} from './${data.basename}'`
    : `import { ${importName} } from './${data.basename}'`;

  return dedent`
  import type { Meta, StoryObj } from '${data.frameworkPackageName}';

  ${importStatement};

  const meta = {
    component: ${importName}
  } satisfies Meta<typeof ${importName}>

  export default meta;

  type Story = StoryObj<typeof meta>;

  export const ${data.exportedStoryName}: Story = {}
  `;
}
