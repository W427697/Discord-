export * from '@storybook/core/dist/modules/types/index';

// TODO, find solution for agnostic logger
// can't use deprecate here, because we'd have to choose between node-logger and client-logger
// it's used in both places
console.log('you imported @storybook/types directly, please import from @storybook/core');
