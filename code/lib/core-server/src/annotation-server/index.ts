import type { Signature } from 'ts-morph';
import { Project, ScriptTarget, SyntaxKind } from 'ts-morph';
import type { Options } from '@storybook/types';

export async function createAnnotationsServer(
  options: Options,
  tsConfigFilePath: string | undefined
) {
  const project = new Project({
    tsConfigFilePath,
    compilerOptions: {
      target: ScriptTarget.ESNext,
    },

    skipAddingFilesFromTsConfig: true,
  });

  return function analyze(path: string) {
    let sourceFile = project.getSourceFile(path);
    if (!sourceFile) {
      sourceFile = project.addSourceFileAtPath(path);
      project.resolveSourceFileDependencies();
    }

    const defaultExport = sourceFile.getExportedDeclarations().get('default')?.at(0);

    const propertyAssignment = defaultExport
      ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
      .find((decl) => decl.getName() === 'component');

    const initializer = propertyAssignment?.getInitializer();

    if (initializer?.isKind(SyntaxKind.Identifier)) {
      let value: Signature | undefined;
      const definition = initializer.getDefinitionNodes().at(0);

      if (definition?.isKind(SyntaxKind.VariableDeclaration)) {
        const i = definition.getInitializer();
        if (i?.isKind(SyntaxKind.ArrowFunction)) {
          value = i.getSignature();
        } else if (i?.isKind(SyntaxKind.FunctionExpression)) {
          value = i.getSignature();
        } else if (i?.isKind(SyntaxKind.FunctionDeclaration)) {
          value = i.getSignature();
        } else {
          console.error('C', i?.getFullText());
        }
      } else if (definition?.isKind(SyntaxKind.FunctionDeclaration)) {
        value = definition.getSignature();
      }

      // BACKUP: get the location on the definition, and maybe pass it to another tool to get the "description"
      const r = value?.getDeclaration();
      console.log({
        start: r?.getFullStart(),
        width: r?.getFullWidth(),
        file: r?.getSourceFile().getFilePath(),
      });

      return {
        start: r?.getFullStart(),
        width: r?.getFullWidth(),
        file: r?.getSourceFile().getFilePath(),
      };

      // MANUAL: try to get the "description" ourselves, this code is not complete, and will not be super-fun to maintain.
      // console.log(value?.getParameters().map((p) => p.getFullyQualifiedName()));
      // console.log(value?.getJsDocTags().map((p) => p.getText()));
      // console.log(value?.getReturnType().getText());

      // HOPEFULLY: we can feed the AST node into some other tool, that can give us the "description"
      // candidate:
      // - https://ts-docs.github.io/ts-docs/m.extractor/m.extractor/index.html
      // - https://github.com/microsoft/tsdoc/blob/main/api-demo/src/advancedDemo.ts
      // - https://github.com/ts-docs/ts-docs
      // - https://github.com/TypeStrong/typedoc
      //   ^ this looks extremely promising, but it doesn't seem to have a documented node API for extracting the "description"
      //     https://github.com/TypeStrong/typedoc/blob/master/src/lib/application.ts#L550 <- this is the closest thing I could find

      // console.log(definition?.getKindName());
    } else {
      console.error(
        'annotations-server CANNOT FIND COMPONENT in: ' +
          sourceFile.getFilePath() +
          '. It expected an Identifier at default.component, but got: \n' +
          (initializer?.getFullText() || 'nothing')
      );
      console.log(initializer?.getFullText());
    }
  };
}
