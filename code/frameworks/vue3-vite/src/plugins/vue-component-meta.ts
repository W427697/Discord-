import findPackageJson from 'find-package-json';
import MagicString from 'magic-string';
import path from 'path';
import type { PluginOption } from 'vite';
import {
  TypeMeta,
  createComponentMetaChecker,
  type ComponentMeta,
  type MetaCheckerOptions,
} from 'vue-component-meta';

type MetaSource = {
  exportName: string;
  displayName: string;
  sourceFiles: string;
} & ComponentMeta &
  MetaCheckerOptions['schema'];

export async function vueComponentMeta(): Promise<PluginOption> {
  const { createFilter } = await import('vite');

  // not stories files
  const exclude = /(\.stories\.ts|\.stories\.js|\.stories\.tsx|\.stories\.jsx)$/;
  const include = /\.(vue|ts|js|tsx|jsx)$/;
  const filter = createFilter(include, exclude);

  const checkerOptions: MetaCheckerOptions = {
    forceUseTs: true,
    noDeclarations: true,
    printer: { newLine: 1 },
  };

  const checker = createComponentMetaChecker(
    path.join(getProjectRoot(), 'tsconfig.json'),
    checkerOptions
  );

  return {
    name: 'storybook:vue-component-meta-plugin',
    transform(src, id) {
      if (!filter(id)) return undefined;

      try {
        const exportNames = checker.getExportNames(id);
        const componentsMeta = exportNames.map((name) => checker.getComponentMeta(id, name));

        const metaSources = componentsMeta
          .filter((meta) => meta.type !== TypeMeta.Unknown)
          // filter out empty meta
          .filter((meta) => {
            return (
              meta.props.length || meta.events.length || meta.slots.length || meta.exposed.length
            );
          })
          .map<MetaSource>((meta, index) => {
            const exportName = exportNames[index];

            const exposed =
              // the meta also includes duplicated entries in the "exposed" array with "on"
              // prefix (e.g. onClick instead of click), so we need to filter them out here
              meta.exposed
                .filter((expose) => {
                  let nameWithoutOnPrefix = expose.name;

                  if (nameWithoutOnPrefix.startsWith('on')) {
                    nameWithoutOnPrefix = lowercaseFirstLetter(expose.name.replace('on', ''));
                  }

                  const hasEvent = meta.events.find((event) => event.name === nameWithoutOnPrefix);
                  return !hasEvent;
                })
                // remove unwanted duplicated "$slots" expose
                .filter((expose) => {
                  if (expose.name === '$slots') {
                    const slotNames = meta.slots.map((slot) => slot.name);
                    return !slotNames.every((slotName) => expose.type.includes(slotName));
                  }
                  return true;
                });

            return {
              exportName,
              displayName: exportName === 'default' ? getFilenameWithoutExtension(id) : exportName,
              ...meta,
              exposed,
              sourceFiles: id,
            };
          });

        // if there is no component meta, return undefined
        if (metaSources.length === 0) return undefined;

        const s = new MagicString(src);

        metaSources.forEach((meta) => {
          const isDefaultExport = meta.exportName === 'default';

          if (!id.endsWith('.vue') && isDefaultExport) {
            // we can not add the __docgenInfo if the component is default exported directly
            // so we need to safe it to a variable instead and export default it instead
            s.replace('export default defineComponent(', 'const _sfc_main = defineComponent(');
            s.append('\nexport default _sfc_main;');
          }

          const name = isDefaultExport ? '_sfc_main' : meta.exportName;
          s.append(`\n;${name}.__docgenInfo = ${JSON.stringify(meta)}`);
        });

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

/**
 * Gets the absolute path to the project root.
 */
function getProjectRoot() {
  const projectRoot = findPackageJson().next().value?.path ?? '';

  const currentFileDir = path.dirname(__filename);
  const relativePathToProjectRoot = path.relative(currentFileDir, projectRoot);

  return path.resolve(currentFileDir, relativePathToProjectRoot);
}

/**
 * Gets the filename without file extension.
 */
function getFilenameWithoutExtension(filename: string) {
  return path.parse(filename).name;
}

/**
 * Lowercases the first letter.
 */
function lowercaseFirstLetter(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
