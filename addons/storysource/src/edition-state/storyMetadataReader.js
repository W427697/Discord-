import { FAKE_PREFIX, BOOTSTRAPPER_JS } from './paths';
import { getFrameworkName } from './frameworkOverridesReader';

export function readMetadata({ idsToFrameworks, dependencies, story, kind }) {
  const framework = getFrameworkName({ idsToFrameworks, story, kind });
  const storybookVersion = 'next';
  const setOfDependencies = Array.from(
    new Set(
      (dependencies || []).concat(
        framework || '@storybook/react',
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
