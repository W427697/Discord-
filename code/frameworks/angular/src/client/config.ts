import './globals';

export { render, renderToRoot } from './render';
export { decorateStory as applyDecorators } from './decorateStory';

export const parameters = { framework: 'angular' as const };
