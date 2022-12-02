import { getRendererName } from '@storybook/core-common';
import type { PreviewAnnotation } from '@storybook/types';
import { virtualPreviewFile, virtualStoriesFile } from './virtual-file-names';
import type { ExtendedOptions } from './types';
import { processPreviewAnnotation } from './utils/process-preview-annotation';

export async function generateIframeScriptCode(options: ExtendedOptions) {
  const { presets } = options;
  const rendererName = await getRendererName(options);

  const previewAnnotations = await presets.apply<PreviewAnnotation[]>(
    'previewAnnotations',
    [],
    options
  );
  const configEntries = [...previewAnnotations].filter(Boolean).map(processPreviewAnnotation);

  const filesToImport = (files: string[], name: string) =>
    files.map((el, i) => `import ${name ? `* as ${name}_${i} from ` : ''}'${el}'`).join('\n');

  const importArray = (name: string, length: number) =>
    new Array(length).fill(0).map((_, i) => `${name}_${i}`);

  // the "__DO_NOT_USE_OR_YOU_WILL_BE_FIRED_STORYSTOREV6_API__" is a experiment I tried to fix the vite-builder in dev mode.
  // it should be removed, if this is the only way to make things work (oof), then it likely mean we have to add more, and add it to all renderers
  // but I'm really hoping we do not have to do that.

  // noinspection UnnecessaryLocalVariableJS
  /** @todo Inline variable and remove `noinspection` */
  // language=JavaScript
  const code = `
    // Ensure that the client API is initialized by the framework before any other iframe code
    // is loaded. That way our client-apis can assume the existence of the API+store
    import { configure, __DO_NOT_USE_OR_YOU_WILL_BE_FIRED_STORYSTOREV6_API__ } from '${rendererName}';
    
    import { logger } from '@storybook/client-logger';

    const { clientApi } = __DO_NOT_USE_OR_YOU_WILL_BE_FIRED_STORYSTOREV6_API__;

    ${filesToImport(configEntries, 'config')}
    
    import * as preview from '${virtualPreviewFile}';
    import * as previewApi from '@storybook/preview-api';
    import { configStories } from '${virtualStoriesFile}';
        
    const configs = [${importArray('config', configEntries.length)
      .concat('preview.default')
      .join(',')}].filter(Boolean)

    configs.forEach(config => {
      Object.keys(config).forEach((key) => {
        const value = config[key];
        switch (key) {
          case 'args': {
            return clientApi.addArgs(value);
          }
          case 'argTypes': {
            return clientApi.addArgTypes(value);
          }
          case 'decorators': {
            return value.forEach((decorator) => clientApi.addDecorator(decorator, false));
          }
          case 'loaders': {
            return value.forEach((loader) => clientApi.addLoader(loader, false));
          }
          case 'parameters': {
            return clientApi.addParameters({ ...value }, false);
          }
          case 'argTypesEnhancers': {
            return value.forEach((enhancer) => clientApi.addArgTypesEnhancer(enhancer));
          }
          case 'argsEnhancers': {
            return value.forEach((enhancer) => clientApi.addArgsEnhancer(enhancer))
          }
          case 'render': {
            return previewApi.setGlobalRender(value)
          }
          case 'globals':
          case 'globalTypes': {
            const v = {};
            v[key] = value;
            return clientApi.addParameters(v, false);
          }
          case 'decorateStory':
          case 'applyDecorators':
          case 'renderToDOM': // deprecated
          case 'renderToCanvas': {
            return null; // This key is not handled directly in v6 mode.
          }
          case 'runStep': {
            return previewApi.addStepRunner(value);
          }
          default: {
            // eslint-disable-next-line prefer-template
            return console.log(key + ' was not supported :( !');
          }
        }
      });
    })
    
    /* TODO: not quite sure what to do with this, to fix HMR
    if (import.meta.hot) {
        import.meta.hot.accept();    
    }
    */

    configStories(configure);
    `.trim();
  return code;
}
