// Here we map the name of a module to their NAME in the global scope.
// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const _globals = {
  '@storybook/global': '__STORYBOOK_MODULE_GLOBAL__',
  '@storybook/channels': '__STORYBOOK_MODULE_CHANNELS__',
  '@storybook/client-logger': '__STORYBOOK_MODULE_CLIENT_LOGGER__',
  '@storybook/core-events': '__STORYBOOK_MODULE_CORE_EVENTS__',
  '@storybook/preview-api': '__STORYBOOK_MODULE_PREVIEW_API__',
};

export const globals: typeof _globals & Record<string, string> = _globals;
