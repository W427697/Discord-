import dedent from 'ts-dedent';
import { StorybookError } from './storybook-error';

/**
 * If you can't find a suitable category for your error, create one
 * based on the package name/file path of which the error is thrown.
 * For instance:
 * If it's from @storybook/client-logger, then CLIENT-LOGGER
 * If it's from a package that is too broad, e.g. @storybook/ui in the manager package, then use a combination like UI_MANAGER
 */
export enum Category {
  CLIENT_LOGGER = 'CLIENT-LOGGER',
  CHANNELS = 'CHANNELS',
  CORE_COMMON = 'CORE-COMMON',
  CORE_EVENTS = 'CORE-EVENTS',
  INSTRUMENTER = 'INSTRUMENTER',
  UI_MANAGER = 'UI_MANAGER',
  MANAGER_API = 'MANAGER-API',
  PREVIEW = 'PREVIEW',
  PREVIEW_API = 'PREVIEW-API',
  REACT_DOM_SHIM = 'REACT-DOM-SHIM',
  ROUTER = 'ROUTER',
  THEMING = 'THEMING',
  FRAMEWORK_ANGULAR = 'FRAMEWORK-ANGULAR',
  FRAMEWORK_EMBER = 'FRAMEWORK-EMBER',
  FRAMEWORK_HTML_VITE = 'FRAMEWORK-HTML-VITE',
  FRAMEWORK_HTML_WEBPACK5 = 'FRAMEWORK-HTML-WEBPACK5',
  FRAMEWORK_NEXTJS = 'FRAMEWORK-NEXTJS',
  FRAMEWORK_PREACT_VITE = 'FRAMEWORK-PREACT-VITE',
  FRAMEWORK_PREACT_WEBPACK5 = 'FRAMEWORK-PREACT-WEBPACK5',
  FRAMEWORK_REACT_VITE = 'FRAMEWORK-REACT-VITE',
  FRAMEWORK_REACT_WEBPACK5 = 'FRAMEWORK-REACT-WEBPACK5',
  FRAMEWORK_SERVER_WEBPACK5 = 'FRAMEWORK-SERVER-WEBPACK5',
  FRAMEWORK_SVELTE_VITE = 'FRAMEWORK-SVELTE-VITE',
  FRAMEWORK_SVELTE_WEBPACK5 = 'FRAMEWORK-SVELTE-WEBPACK5',
  FRAMEWORK_SVELTEKIT = 'FRAMEWORK-SVELTEKIT',
  FRAMEWORK_VUE_VITE = 'FRAMEWORK-VUE-VITE',
  FRAMEWORK_VUE_WEBPACK5 = 'FRAMEWORK-VUE-WEBPACK5',
  FRAMEWORK_VUE3_VITE = 'FRAMEWORK-VUE3-VITE',
  FRAMEWORK_VUE3_WEBPACK5 = 'FRAMEWORK-VUE3-WEBPACK5',
  FRAMEWORK_WEB_COMPONENTS_VITE = 'FRAMEWORK-WEB-COMPONENTS-VITE',
  FRAMEWORK_WEB_COMPONENTS_WEBPACK5 = 'FRAMEWORK-WEB-COMPONENTS-WEBPACK5',
  RENDERER_HTML = 'RENDERER-HTML',
  RENDERER_PREACT = 'RENDERER-PREACT',
  RENDERER_REACT = 'RENDERER-REACT',
  RENDERER_SERVER = 'RENDERER-SERVER',
  RENDERER_SVELTE = 'RENDERER-SVELTE',
  RENDERER_VUE = 'RENDERER-VUE',
  RENDERER_VUE3 = 'RENDERER-VUE3',
  RENDERER_WEB_COMPONENTS = 'RENDERER-WEB-COMPONENTS',
}

export class MissingStoryAfterHmr extends StorybookError {
  readonly category = Category.PREVIEW_API;

  readonly code = 1;

  readonly telemetry = true;

  constructor(public storyId: string) {
    super();
  }

  template() {
    return dedent`Couldn't find story matching id '${this.storyId}' after HMR.
    - Did you just rename a story?
    - Did you remove it from your CSF file?
    - Are you sure a story with the id '${this.storyId}' exists?
    - Please check the values in the stories field of your main.js config and see if they would match your CSF File.
    - Also check the browser console and terminal for potential error messages.`;
  }
}

export class ProviderDoesNotExtendBaseProvider extends StorybookError {
  readonly category = Category.UI_MANAGER;

  readonly code = 1;

  readonly telemetry = true;

  template() {
    return `The Provider passed into Storybook's UI is not extended from the base Provider. Please check your Provider implementation.`;
  }
}
