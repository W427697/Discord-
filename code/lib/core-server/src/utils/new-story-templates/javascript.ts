import dedent from 'ts-dedent';

export function getJavaScriptTemplateForNewStoryFile(data: {
  /** The components file name without the extension */
  basename: string;
  componentExportName: string;
  default: boolean;
  /** The exported name of the default story */
  exportedStoryName: string;
}) {
  const importName = data.default ? 'Component' : data.componentExportName;
  const importStatement = data.default
    ? `import ${importName} from './${data.basename}';`
    : `import { ${importName} } from './${data.basename}';`;

  return dedent`
  ${importStatement}

  const meta = {
    component: ${importName}
  }
  
  export default meta;
  
  export const ${data.exportedStoryName} = {}
  `;
}
