/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';

import type { PluginOption } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

import type { MetaCheckerOptions } from 'vue-component-meta';
import { createComponentMetaChecker } from 'vue-component-meta';

export function vueDocgen(): PluginOption {
  const include = /\.(vue|ts)$/;
  const filter = createFilter(include);

  const checkerOptions: MetaCheckerOptions = {
    forceUseTs: true,
    schema: { ignore: ['MyIgnoredNestedProps'] },
    printer: { newLine: 1 },
  };

  const checker = createComponentMetaChecker(
    path.join(__dirname, '../../../../tsconfig.json'),
    checkerOptions
  );

  return {
    name: 'storybook:vue-docgen-plugin',

    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      let metaSource;
      try {
        const meta = checker.getComponentMeta(id);

        console.log('\n- meta = props :', meta.props);
        metaSource = {
          exportName: checker.getExportNames(id)[0],
          displayName: id
            .split(path.sep)
            .slice(-1)
            .join('')
            .replace(/\.(vue|ts)/, ''),
          ...meta,
          sourceFiles: id,
        };
        const tsVueComponent = id.endsWith('.ts') && isVueComponent(id);
        const isVue = tsVueComponent || id.endsWith('.vue');

        if (!isVue) {
          return undefined;
        }
        console.log('metaSource = ', metaSource);
        metaSource = JSON.stringify(metaSource);

        const s = new MagicString(src);
        if (tsVueComponent && src.includes('export default defineComponent')) {
          s.replace('export default defineComponent', 'const _sfc_main = defineComponent');
          s.append(`\nexport default _sfc_main`);
        }

        s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

        // console.log('s = ', s.toString());

        const ss = {
          code: s.toString(),
          map: s.generateMap({ hires: true, source: id }),
        };

        if (tsVueComponent || id.endsWith('Button.vue'))
          console.log(
            'tsVueComponent = \n',
            '---------------------------------------------------------------\n',
            ss.code,
            '\n---------------------------------------------------------------\n',
            '\n'
          );
        return ss;
      } catch (e) {
        console.log('-------Checker error = ', e);
        return undefined;
      }
    },
  };
}

function isVueComponent(fileSource: string) {
  try {
    const module = getDefaultExport(fileSource);
    console.log('getDefaultExport = ', module);
    if (module === 'defineComponent') return true;
  } catch (e) {
    console.log('getDefaultExport error = ', e);
    return false;
  }
  return false;
}

function getDefaultExport(filePath: string): any {
  console.log('-- filePath > ', filePath);
  // eslint-disable-next-line global-require
  const ts: typeof import('typescript/lib/tsserverlibrary') = require('typescript');
  // Create a program from the main entry point.
  const program = ts.createProgram([filePath], {});
  // Parse the main source file and look for type definitions.
  const sourceFile = program.getSourceFile(filePath)!;
  // eslint-disable-next-line no-restricted-syntax
  for (const statement of sourceFile.statements) {
    // console.log('\nstatement = ', statement);
    if (
      ts.isExportAssignment(statement) &&
      statement.expression.expression?.escapedText === 'defineComponent'
    ) {
      return 'defineComponent';
    }
  }
  return undefined;
}
