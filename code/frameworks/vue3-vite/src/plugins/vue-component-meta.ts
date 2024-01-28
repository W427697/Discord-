// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { createFilter, type PluginOption } from 'vite';
import path from 'path';

import findPackageJson from 'find-package-json';

import MagicString from 'magic-string';

import type { ComponentMeta, MetaCheckerOptions } from 'vue-component-meta';
import { TypeMeta, createComponentMetaCheckerByJsonConfig } from 'vue-component-meta';

type MetaSource = {
  exportName: string;
  displayName: string;
  sourceFiles: string;
} & ComponentMeta &
  MetaCheckerOptions['schema'];

export function vueComponentMeta(): PluginOption {
  // not stories files
  const exclude = /(\.stories\.ts|\.stories\.js|\.stories\.tsx|\.stories\.jsx)$/;
  const include = /\.(vue|ts|js|tsx|jsx)$/;
  const filter = createFilter(include, exclude);

  const checkerOptions: MetaCheckerOptions = {
    forceUseTs: true,
    noDeclarations: true,
    schema: { ignore: ['MyIgnoredNestedProps'] },
    printer: { newLine: 1 },
  };

  const checker = createComponentMetaCheckerByJsonConfig(
    path.resolve(getProjectRoot().absolutePathToProjectRoot),
    {
      extends: '../../tsconfig.json',
      include: ['**/*'],
    },
    checkerOptions
  );

  return {
    name: 'storybook:vue-component-meta-plugin',
    async transform(src: string, id: string) {
      // console.log('. ');
      if (!filter(id)) return undefined;

      let metaSource;
      try {
        const exportNames = checker.getExportNames(id);

        const componentsMeta = exportNames.map((name) => checker.getComponentMeta(id, name));

        const metaSources: MetaSource[] = [];
        componentsMeta.forEach((meta) => {
          const exportName = exportNames[componentsMeta.indexOf(meta)];

          if (meta.type === TypeMeta.Class || meta.type === TypeMeta.Function) {
            metaSources.push({
              exportName,
              displayName: exportName === 'default' ? getNameFromFile(id).name : exportName,
              ...meta,
              sourceFiles: id,
            });
          }
        });
        const s = new MagicString(src);
        // if there is no component meta, return undefined
        if (metaSources.length === 0) return undefined;
        // if there is only one component meta, we add it to the default export
        if (metaSources.length === 1) {
          metaSource = JSON.stringify(metaSources[0]);
          if (
            !id.endsWith('.vue') &&
            metaSources[0].exportName === 'default' &&
            (metaSources[0].type === TypeMeta.Function || metaSources[0].type === TypeMeta.Class)
          ) {
            s.replace('export default defineComponent', 'const _sfc_main = defineComponent');
            s.append(`\nexport default _sfc_main`);
          } else if (metaSources[0].exportName !== 'default') {
            s.append(`\nexport const _sfc_main = defineComponent({})`);
            s.append(`\n;${metaSources[0].exportName}.__docgenInfo = ${metaSource}`);
          }
          s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);
        }
        // if there are multiple component meta, we add them to the named exports
        if (metaSources.length > 1) {
          if (!id.endsWith('.vue')) {
            const docgenInfos = metaSources
              .map((m) => `${m.exportName}.__docgenInfo = ${JSON.stringify(m)}`)
              .join(';\n');
            s.append(`\n${docgenInfos}`);
          }
        }

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

/** utility functions  */

function getProjectRoot() {
  const projectRoot = findPackageJson().next().value?.path ?? '';

  const currentFileDir = path.dirname(__filename);
  const relativePathToProjectRoot = path.relative(currentFileDir, projectRoot);
  const absolutePathToProjectRoot = path.resolve(currentFileDir, relativePathToProjectRoot);

  return { relativePathToProjectRoot, absolutePathToProjectRoot };
}

function getNameFromFile(filename: string) {
  const fileName = path.basename(filename);
  const name = fileName.replace(/\.(vue|ts|js|tsx|jsx)/, '');
  return { fileName, name };
}
