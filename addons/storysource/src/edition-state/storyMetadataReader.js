import { FAKE_PREFIX, BOOTSTRAPPER_JS } from './paths';

export function readMetadata({ dependencies, story, kind }) {
  const storybookVersion = 'latest';
  const setOfDependencies = Array.from(
    new Set(
      (dependencies || []).concat(
        '@storybook/addons',
        '@storybook/core-events',
        '@storybook/router',
        '@storybook/theming',
        'react'
      )
    )
  );
  return {
    name: `${story}-${kind}`,
    entry: `${FAKE_PREFIX}${BOOTSTRAPPER_JS}`,
    dependenciesMapping: Object.assign(
      {},
      ...setOfDependencies.map(d => ({
        [d]: /^@storybook\//.test(d) ? storybookVersion : 'latest',
      }))
    ),
  };
}
