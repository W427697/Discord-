/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';

import type { PluginOption } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

import type { MetaCheckerOptions } from 'vue-component-meta';
import { createComponentMetaChecker } from 'vue-component-meta';

export function vueComponentMeta(): PluginOption {
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

  const isVueComponent = (fileSource: string) => {
    try {
      const module = getDefaultExport(fileSource);
      if (module === 'defineComponent') return true;
    } catch (e) {
      return false;
    }
    return false;
  };

  const getDefaultExport = (filePath: string) => {
    // eslint-disable-next-line global-require
    const ts = require('typescript');
    const program = ts.createProgram([filePath], {});
    const sourceFile = program.getSourceFile(filePath)!;
    // eslint-disable-next-line no-restricted-syntax
    for (const statement of sourceFile.statements) {
      if (ts.isExportAssignment(statement)) {
        const expression = statement.expression as ts.AsExpression;
        if ((expression.expression as ts.Identifier).escapedText === 'defineComponent')
          return 'defineComponent';
      }
    }
    return undefined;
  };

  return {
    name: 'storybook:vue-component-meta-plugin',
    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      let metaSource;
      try {
        const meta = checker.getComponentMeta(id);

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

        metaSource = JSON.stringify(metaSource);

        const s = new MagicString(src);
        if (tsVueComponent && src.includes('export default defineComponent')) {
          s.replace('export default defineComponent', 'const _sfc_main = defineComponent');
          s.append(`\nexport default _sfc_main`);
        }

        s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true, source: id }),
        };
      } catch (e) {
        return undefined;
      }
    },
  };
}
