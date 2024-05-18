import { describe, it, expect } from 'vitest';
import type { JsPackageManager } from '@storybook/core/dist/common';
import { sbBinary } from './sb-binary';

const checkStorybookBinary = async ({
  packageManager,
  storybookVersion = '7.0.0',
}: {
  packageManager: Partial<JsPackageManager>;
  storybookVersion?: string;
}) => {
  return sbBinary.check({
    packageManager: packageManager as any,
    storybookVersion,
    mainConfig: {} as any,
  });
};

describe('storybook-binary fix', () => {
  describe('sb >= 7.0', () => {
    it('should no-op in NX projects', async () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          switch (packageName) {
            case '@storybook/react':
              return Promise.resolve('7.0.0');
            case '@nrwl/storybook':
              return Promise.resolve('15.7.1');
            default:
              return null;
          }
        },
        retrievePackageJson: () => Promise.resolve({}),
      } as Partial<JsPackageManager>;

      await expect(
        checkStorybookBinary({
          packageManager,
        })
      ).resolves.toBeFalsy();
    });

    it('should add storybook dependency if not present', async () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          switch (packageName) {
            case '@storybook/react':
              return Promise.resolve('7.0.0-alpha.0');
            default:
              return null;
          }
        },
        retrievePackageJson: () => Promise.resolve({}),
      } as Partial<JsPackageManager>;

      await expect(
        checkStorybookBinary({
          packageManager,
        })
      ).resolves.toEqual(
        expect.objectContaining({
          hasSbBinary: false,
          hasStorybookBinary: false,
        })
      );
    });

    it('should remove sb dependency if it is present', async () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          switch (packageName) {
            case '@storybook/react':
              return Promise.resolve('7.0.0-alpha.0');
            case 'sb':
              return Promise.resolve('6.5.0');
            default:
              return null;
          }
        },
        retrievePackageJson: () => Promise.resolve({}),
      } as Partial<JsPackageManager>;

      await expect(
        checkStorybookBinary({
          packageManager,
        })
      ).resolves.toEqual(
        expect.objectContaining({
          hasSbBinary: true,
          hasStorybookBinary: false,
        })
      );
    });

    it('should no op if storybook is present and sb is not present', async () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          switch (packageName) {
            case '@storybook/react':
              return Promise.resolve('7.0.0-alpha.0');
            case 'storybook':
              return Promise.resolve('7.0.0-alpha.0');
            default:
              return null;
          }
        },
        retrievePackageJson: () => Promise.resolve({}),
      } as Partial<JsPackageManager>;

      await expect(
        checkStorybookBinary({
          packageManager,
        })
      ).resolves.toBeNull();
    });
  });
});
