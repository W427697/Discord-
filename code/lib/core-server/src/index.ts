// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./typings.d.ts" />

export { getPreviewHeadTemplate, getPreviewBodyTemplate } from '@junk-temporary-prototypes/core-common';

export * from './build-static';
export * from './build-dev';
export * from './withTelemetry';
export { default as build } from './standalone';
