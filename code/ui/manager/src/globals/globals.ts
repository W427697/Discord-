// Here we map the name of a module to their REFERENCE in the global scope.
export const globalsNameReferenceMap = {
  react: '__REACT__',
  'react-dom': '__REACT_DOM__',
  '@storybook/components': '__STORYBOOK_COMPONENTS__',
  '@storybook/icons': '__STORYBOOK_ICONS__',
  '@storybook/manager-api': '__STORYBOOK_API__',

  '@storybook/channels': '__STORYBOOK_CHANNELS__',
  '@storybook/core/dist/channels': '__STORYBOOK_CHANNELS__',

  '@storybook/core-events': '__STORYBOOK_CORE_EVENTS__',
  '@storybook/core/dist/core-events': '__STORYBOOK_CORE_EVENTS__',

  '@storybook/core-events/manager-errors': '__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__',
  '@storybook/core/dist/manager-errors': '__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__',

  '@storybook/router': '__STORYBOOK_ROUTER__',
  '@storybook/core/dist/router': '__STORYBOOK_ROUTER__',

  '@storybook/theming': '__STORYBOOK_THEMING__',
  '@storybook/core/dist/theming': '__STORYBOOK_THEMING__',
  '@storybook/theming/create': '__STORYBOOK_THEMING_CREATE__',
  '@storybook/core/dist/theming/create': '__STORYBOOK_THEMING_CREATE__',

  '@storybook/client-logger': '__STORYBOOK_CLIENT_LOGGER__',
  '@storybook/core/dist/client-logger': '__STORYBOOK_CLIENT_LOGGER__',

  '@storybook/types': '__STORYBOOK_TYPES__',
  '@storybook/core/dist/types': '__STORYBOOK_TYPES__',
} as const;

export const globalPackages = Object.keys(globalsNameReferenceMap) as Array<
  keyof typeof globalsNameReferenceMap
>;
