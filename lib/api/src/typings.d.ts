declare module '@storybook/semver';
declare module 'preval.macro';

// provided by the webpack define plugin
declare var DOCS_MODE: string | undefined;
declare var RELEASE_NOTES_DATA: string | undefined;
declare var VERSIONCHECK: string | undefined;
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
declare var requestIdleCallback: (callback: Function, options: { timeout?: number }) => string;
// https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
declare var cancelIdleCallback: (handle: string) => undefined;
