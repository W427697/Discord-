// Here we map the name of a module to their REFERENCE in the global scope.
export const globalsNameReferenceMap = {
  react: '__REACT__',
  'react-dom': '__REACT_DOM__',
  '@storybook/components': '__STORYBOOK_COMPONENTS__',
  '@storybook/channels': '__STORYBOOK_CHANNELS__',
  '@storybook/core-events': '__STORYBOOK_CORE_EVENTS__',
  '@storybook/core-events/manager-errors': '__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__',
  '@storybook/router': '__STORYBOOK_ROUTER__',
  '@storybook/theming': '__STORYBOOK_THEMING__',
  '@storybook/instrumenter': '__STORYBOOK_INSTRUMENTER__',
  '@storybook/core/dist/modules/instrumenter/index': '__STORYBOOK_CORE_INSTRUMENTER__',
  '@storybook/icons': '__STORYBOOK_ICONS__',
  '@storybook/manager-api': '__STORYBOOK_API__',
  '@storybook/client-logger': '__STORYBOOK_CLIENT_LOGGER__',
  '@storybook/types': '__STORYBOOK_TYPES__',
  '@storybook/core/dist/modules/components/index': '__STORYBOOK_CORE_COMPONENTS__',
  '@storybook/core/dist/modules/channels/index': '__STORYBOOK_CORE_CHANNELS__',
  '@storybook/core/dist/modules/events/index': '__STORYBOOK_CORE_CORE_EVENTS__',
  '@storybook/core/dist/modules/events/manager-errors':
    '__STORYBOOK_CORE_CORE_EVENTS_MANAGER_ERRORS__',
  '@storybook/core/dist/modules/router/index': '__STORYBOOK_CORE_ROUTER__',
  '@storybook/core/dist/modules/theming/index': '__STORYBOOK_CORE_THEMING__',
  '@storybook/core/dist/modules/manager-api/index': '__STORYBOOK_CORE_API__',
  '@storybook/core/dist/modules/client-logger/index': '__STORYBOOK_CORE_CLIENT_LOGGER__',
  '@storybook/core/dist/modules/types/index': '__STORYBOOK_CORE_TYPES__',
} as const;

export const globalPackages = Object.keys(globalsNameReferenceMap) as Array<
  keyof typeof globalsNameReferenceMap
>;
