import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import * as ReactDocGenTS from 'react-docgen-typescript';
// @ts-ignore How to type react-docgen?
import * as ReactDocGen from 'react-docgen';

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
    const extName = path.extname(storyFile);
    let documentation = {};

    // TODO: Handle vue etc. -> switch/case
    if (['.ts', '.tsx'].includes(extName)) {
      documentation = parseTSReactDocumentation(storyPath);
    } else if (['.js', '.jsx'].includes(extName)) {
      documentation = parseJSReactDocumentation(storyPath);
    }

    res.json(documentation);
  });
}

// TODO: Push this to the right place (type parsers for different targets)
function parseTSReactDocumentation(filePath: string) {
  // The simplest option
  // const componentDocs = reactDocGenTS.parse(filename);

  // react-docgen-typescript-plugin does something along this to allow
  // customizability
  const compilerOptions = {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest,
  };
  const reactDocgenTSOptions = {};
  const tsProgram = ts.createProgram([filePath], compilerOptions);
  const reactDocGenTSParser = ReactDocGenTS.withCompilerOptions(
    compilerOptions,
    reactDocgenTSOptions
  );
  const componentDocs = reactDocGenTSParser.parseWithProgramProvider([filePath], () => tsProgram);

  return componentDocs;
}

// Adapted from https://github.com/storybookjs/babel-plugin-react-docgen
const defaultHandlers = Object.values(ReactDocGen.handlers).map((handler) => handler);

function parseJSReactDocumentation(filePath: string) {
  const source = fs.readFileSync(filePath);

  return ReactDocGen.parse(
    source,
    ReactDocGen.resolver.findAllExportedComponentDefinitions,
    defaultHandlers
  );
}
