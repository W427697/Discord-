import type { StorybookConfig } from '@storybook/types';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import { deprecatedFeatures } from './deprecated-features';

const checkDeprecatedFeatures = async ({
  packageJson = {},
  main: mainConfig,
  storybookVersion = '7.0.0',
}: {
  packageJson?: PackageJson;
  main: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  mockStorybookData({ mainConfig, storybookVersion });

  return deprecatedFeatures.check({
    packageManager: makePackageManager(packageJson),
  });
};

describe('deprecated-features', () => {
  afterEach(jest.restoreAllMocks);

  it('detected unneded features', async () => {
    await expect(
      checkDeprecatedFeatures({
        main: {
          features: {
            postcss: true,
            previewCsfV3: true,
            breakingChangesV7: true,
            argTypeTargetsV7: true,
            warnOnLegacyHierarchySeparator: true,
            interactionsDebugger: true,
            storyStoreV7: true,
            buildStoriesJson: true,
          } as any,
        },
      })
    ).resolves.toEqual({
      featuresToReMove: [
        'postcss',
        'previewCsfV3',
        'breakingChangesV7',
        'argTypeTargetsV7',
        'warnOnLegacyHierarchySeparator',
        'interactionsDebugger',
      ],
      featuresToWarn: ['storyStoreV7', 'buildStoriesJson'],
    });
  });

  it('should return null when there are no unnecessary features', async () => {
    await expect(
      checkDeprecatedFeatures({ main: { features: { legacyMdx1: true } } })
    ).resolves.toBeFalsy();
  });
});
