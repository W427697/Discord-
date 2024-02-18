import findPackageJson from 'find-package-json';
import fs from 'fs/promises';
import MagicString from 'magic-string';
import path from 'path';
import type { PluginOption } from 'vite';
import {
  TypeMeta,
  createComponentMetaChecker,
  createComponentMetaCheckerByJsonConfig,
  type ComponentMeta,
  type MetaCheckerOptions,
} from 'vue-component-meta';
import { parseMulti } from 'vue-docgen-api';

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

  const projectRoot = getProjectRoot();
  const projectTsConfigPath = path.join(projectRoot, 'tsconfig.json');
  const tsConfigExists = await fileExists(projectTsConfigPath);

  // prefer the tsconfig.json file of the project to support alias etc.
  // if no tsconfig.json file exists, a fallback will be used
  const checker = tsConfigExists
    ? createComponentMetaChecker(projectTsConfigPath, checkerOptions)
    : createComponentMetaCheckerByJsonConfig(
        projectRoot,
        { extends: '../../tsconfig.json', include: ['src/**/*'] },
        checkerOptions
      );

  return {
    name: 'storybook:vue-component-meta-plugin',
    async transform(src, id) {
      if (!filter(id)) return undefined;

      try {
        const exportNames = checker.getExportNames(id);
        let componentsMeta = exportNames.map((name) => checker.getComponentMeta(id, name));
        componentsMeta = await applyTempFixForEventDescriptions(id, componentsMeta);

        const metaSources = componentsMeta
          .filter((meta) => meta.type !== TypeMeta.Unknown)
          // filteasync r out empty meta
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
          const name = isDefaultExport ? '_sfc_main' : meta.exportName;

          // we can only add the "__docgenInfo" to variables that are actually defined in the current file
          // so e.g. re-exports like "export { default as MyComponent } from './MyComponent.vue'" must be ignored
          // to prevent runtime errors
          if (new RegExp(`export {.*${name}.*}`).test(src)) {
            return;
          }

          if (!id.endsWith('.vue') && isDefaultExport) {
            // we can not add the __docgenInfo if the component is default exported directly
            // so we need to safe it to a variable instead and export default it instead
            s.replace('export default defineComponent(', 'const _sfc_main = defineComponent(');
            s.append('\nexport default _sfc_main;');
          }

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

/**
 * Checks whether the given file path exists.
 */
async function fileExists(fullPath: string) {
  try {
    await fs.stat(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Applies a temporary workaround/fix for missing event descriptions because
 * Volar is currently not able to extract them.
 * Will modify the events of the passed meta.
 * Performance note: Based on some quick tests, calling "parseMulti" only takes a few milliseconds (8-20ms)
 * so it should not decrease performance that much. Especially because it is only execute if the component actually
 * has events.
 *
 * Check status of this Volar issue: https://github.com/vuejs/language-tools/issues/3893
 * and update/remove this workaround once Volar supports it:
 * - delete this function
 * - uninstall vue-docgen-api dependency
 */
async function applyTempFixForEventDescriptions(filename: string, componentMeta: ComponentMeta[]) {
  // do not apply temp fix if no events exist for performance reasons
  const hasEvents = componentMeta.some((meta) => meta.events.length);
  if (!hasEvents) return componentMeta;

  try {
    const parsedComponentDocs = await parseMulti(filename);

    // add event descriptions to the existing Volar meta if available
    componentMeta.map((meta, index) => {
      const eventsWithDescription = parsedComponentDocs[index].events;
      if (!meta.events.length || !eventsWithDescription?.length) return meta;

      meta.events = meta.events.map((event) => {
        const description = eventsWithDescription.find((i) => i.name === event.name)?.description;
        if (description) {
          (event as typeof event & { description: string }).description = description;
        }
        return event;
      });

      return meta;
    });
  } finally {
    return componentMeta;
  }
}
