import * as path from 'path';
import ts from 'typescript';
import * as docGen from 'react-docgen-typescript';
// TODO: Apply react-docgen for regular js(x)

export async function useAnnotations(router: any) {
  router.use(async (req: any, res: any, next: any) => {
    if (!req.path.match(/\.annotations\.json$/)) {
      next();

      return;
    }

    // TODO: How to construct the project base path correctly? This is way too coupled
    // to this project.
    const projectBase = path.join(__dirname.split('storybook')[0], 'storybook');
    const exampleBase = 'examples/official-storybook';
    const storyFile = req.path.split('.annotations.json')[0];
    const storyPath = path.join(projectBase, exampleBase, storyFile);

    // The assumption here is that we're parsing React (ts(x)) which probably
    // isn't correct. How do we know which parser to apply?
    const documentation = parseReactDocumentation(storyPath);

    // console.log(projectBase, storyPath, documentation);

    // TODO: Which is the right story to test against?
    res.json(documentation);
  });
}

// TODO: Push this to the right place (type parsers for different targets)
function parseReactDocumentation(filePath: string) {
  // The simplest option
  // const componentDocs = docGen.parse(filename);

  // react-docgen-typescript-plugin does something along this to allow
  // customizability
  const compilerOptions = {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest,
  };
  const docgenOptions = {};
  const tsProgram = ts.createProgram([filePath], compilerOptions);
  const docGenParser = docGen.withCompilerOptions(compilerOptions, docgenOptions);
  const componentDocs = docGenParser.parseWithProgramProvider([filePath], () => tsProgram);

  return componentDocs;
}
