import { expect, it } from 'vitest';

import type { StorybookConfig } from '@storybook/types';
import type { JsPackageManager } from '@storybook/core-common';
import { removeJestTestingLibrary } from './remove-jest-testing-library';

const check = async ({
  packageManager,
  main: mainConfig = {},
  storybookVersion = '8.0.0',
}: {
  packageManager: Partial<JsPackageManager>;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  return removeJestTestingLibrary.check({
    packageManager: packageManager as any,
    configDir: '',
    mainConfig: mainConfig as any,
    storybookVersion,
  });
};

it('should prompt to install the test package and run the codemod', async () => {
  const options = await check({
    packageManager: {
      getAllDependencies: async () => ({
        '@storybook/jest': '1.0.0',
        '@storybook/testing-library': '1.0.0',
      }),
    },
    main: { addons: ['@storybook/essentials', '@storybook/addon-info'] },
  });

  await expect(options).toMatchInlineSnapshot(`
    {
      "incompatiblePackages": [
        "@storybook/jest",
        "@storybook/testing-library",
      ],
    }
  `);

  expect(await removeJestTestingLibrary.prompt(options!)).toMatchInlineSnapshot(`
    "[1mAttention[22m: We've detected that you're using the following packages which are known to be incompatible with Storybook 8:

    - [36m@storybook/jest[39m
    - [36m@storybook/testing-library[39m

    Install the replacement for those packages: [36m@storybook/test[39m

    And run the following codemod:
     [36mnpx sb migrate migrate-to-test-package --glob="**/*.stories.@(js|jsx|ts|tsx)"[39m     "
  `);
});
