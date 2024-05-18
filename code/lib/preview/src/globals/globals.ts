// Here we map the name of a module to their REFERENCE in the global scope.

export const globalsNameReferenceMap = {
  '@storybook/global': '__STORYBOOK_MODULE_GLOBAL__',

  '@storybook/channels': '__STORYBOOK_MODULE_CHANNELS__',
  '@storybook/core/dist/channels': '__STORYBOOK_MODULE_CHANNELS__',

  '@storybook/client-logger': '__STORYBOOK_MODULE_CLIENT_LOGGER__',
  '@storybook/core/dist/client-logger': '__STORYBOOK_MODULE_CLIENT_LOGGER__',

  '@storybook/core-events': '__STORYBOOK_MODULE_CORE_EVENTS__',
  '@storybook/core/dist/core-events': '__STORYBOOK_MODULE_CORE_EVENTS__',

  '@storybook/core-events/preview-errors': '__STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS__',
  '@storybook/core/dist/preview-errors': '__STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS__',

  '@storybook/preview-api': '__STORYBOOK_MODULE_PREVIEW_API__',
  '@storybook/core/dist/preview-api': '__STORYBOOK_MODULE_PREVIEW_API__',

  '@storybook/types': '__STORYBOOK_MODULE_TYPES__',
  '@storybook/core/dist/types': '__STORYBOOK_MODULE_TYPES__',
} as const;

export const globalPackages = Object.keys(globalsNameReferenceMap) as Array<
  keyof typeof globalsNameReferenceMap
>;
