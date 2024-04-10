import dedent from 'ts-dedent';

interface JavaScriptTemplateData {
  /** The components file name without the extension */
  basenameWithoutExtension: string;
  componentExportName: string;
  componentIsDefaultExport: boolean;
  /** The exported name of the default story */
  exportedStoryName: string;
}

export function getJavaScriptTemplateForNewStoryFile(data: JavaScriptTemplateData) {
  const importName = data.componentIsDefaultExport ? 'Component' : data.componentExportName;
  const importStatement = data.componentIsDefaultExport
    ? `import ${importName} from './${data.basenameWithoutExtension}';`
    : `import { ${importName} } from './${data.basenameWithoutExtension}';`;

  return dedent`
  ${importStatement}

  const meta = {
    component: ${importName},
  };
  
  export default meta;
  
  export const ${data.exportedStoryName} = {};
  `;
}
