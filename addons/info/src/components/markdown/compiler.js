import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkReact from 'remark-react';
import remarkGithub from 'remark-github'; // note: uncomment when issue will be solved
import remarkEmoji from 'remark-emoji';
import remarkHighlight from 'remark-highlight.js';

import { options as defaultOptions } from './defaults';

let options = defaultOptions;

function setupProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGithub, {
      repository: options.repository,
    })
    .use(remarkEmoji)
    .use(remarkHighlight)
    .use(remarkReact, { remarkReactComponents: options.components, sanitize: false });
}

let processor = setupProcessor();

export function setOptions(newOptions) {
  options = {
    ...options,
    ...newOptions,
    components: {
      ...options.components,
      ...newOptions.components,
    },
  };
  processor = setupProcessor();
  options = defaultOptions;
}

export function getOptions() {
  return options;
}

export function compile(markdown) {
  return processor.processSync(markdown).contents;
}
