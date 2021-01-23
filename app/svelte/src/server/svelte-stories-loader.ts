import dedent from 'ts-dedent';
import { readFileSync } from 'fs';

import { extractStoriesSources } from './extract-sources';

const parser = require.resolve('../client/parse-stories').replace(/[/\\]/g, '/');

function transformSvelteStories(code: string) {
  // eslint-disable-next-line no-underscore-dangle
  const { resource } = this._module;

  const source = readFileSync(resource).toString();
  const storiesSources = extractStoriesSources(source);

  return dedent`${code}
    const { default: parser } = require('${parser}');
    export const __dynamicStoriesGenerator = (m) => parser(m, ${JSON.stringify(storiesSources)});
  `;
}

export default transformSvelteStories;
