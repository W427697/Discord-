import type { Mock, SpyInstance } from 'vitest';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import type { StorybookConfig } from '@storybook/types';
import type { JsPackageManager } from '../../js-package-manager';
import { angularBuildersMultiproject } from './angular-builders-multiproject';
import * as helpers from '../../helpers';
import * as angularHelpers from '../../generators/ANGULAR/helpers';

const checkAngularBuilders = async ({
  packageManager,
  mainConfig = {},
}: {
  packageManager: Partial<JsPackageManager>;
  mainConfig?: Partial<StorybookConfig>;
}) => {
  return angularBuildersMultiproject.check({
    packageManager: packageManager as any,
    mainConfig: mainConfig as any,
    storybookVersion: '7.0.0',
  });
};

vi.mock('../../helpers', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../helpers')>()),
  isNxProject: vi.fn(),
}));

vi.mock('../../generators/ANGULAR/helpers', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../generators/ANGULAR/helpers')>()),
  AngularJSON: vi.fn(),
}));

describe('is Nx project', () => {
  const packageManager = {
    getPackageVersion: () => {
      return null;
    },
  } as Partial<JsPackageManager>;

  beforeEach(() => {
    (helpers.isNxProject as any as SpyInstance).mockResolvedValue(true);
  });

  it('should return null', async () => {
    await expect(checkAngularBuilders({ packageManager })).resolves.toBeNull();
  });
});

describe('is not Nx project', () => {
  beforeEach(() => {
    (helpers.isNxProject as any as SpyInstance).mockResolvedValue(false);
  });

  describe('angular builders', () => {
    afterEach(() => {
    vi.restoreAllMocks();
  });

    describe('Angular not found', () => {
      const packageManager = {
        getPackageVersion: vi.fn().mockResolvedValue(null),
      } as Partial<JsPackageManager>;

      it('should return null', async () => {
        await expect(
          checkAngularBuilders({ packageManager, mainConfig: { framework: '@storybook/angular' } })
        ).resolves.toBeNull();
      });
    });

    describe('Angular < 14.0.0', () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          if (packageName === '@angular/core') {
            return Promise.resolve('12.0.0');
          }

          return null;
        },
      } as Partial<JsPackageManager>;

      it('should return null', async () => {
        await expect(
          checkAngularBuilders({ packageManager, mainConfig: { framework: '@storybook/angular' } })
        ).resolves.toBeNull();
      });
    });

    describe('Angular >= 14.0.0', () => {
      const packageManager = {
        getPackageVersion: (packageName) => {
          if (packageName === '@angular/core') {
            return Promise.resolve('15.0.0');
          }

          return null;
        },
      } as Partial<JsPackageManager>;

      describe('has one Storybook builder defined', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as Mock).mockImplementation(() => ({
            hasStorybookBuilder: true,
          }));
        });

        it('should return null', async () => {
          await expect(
            checkAngularBuilders({
              packageManager,
              mainConfig: { framework: '@storybook/angular' },
            })
          ).resolves.toBeNull();
        });
      });

      describe('has one project', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as Mock).mockImplementation(() => ({
            hasStorybookBuilder: false,
            projects: {
              project1: { root: 'project1', architect: {} },
            },
            rootProject: 'project1',
          }));
        });

        it('should return null', async () => {
          await expect(
            checkAngularBuilders({
              packageManager,
              mainConfig: { framework: '@storybook/angular' },
            })
          ).resolves.toBeNull();
        });
      });

      describe('has multiple projects without root project defined', () => {
        beforeEach(() => {
          // Mock AngularJSON.constructor
          (angularHelpers.AngularJSON as Mock).mockImplementation(() => ({
            hasStorybookBuilder: false,
            projects: {
              project1: { root: 'project1', architect: {} },
              project2: { root: 'project2', architect: {} },
            },
            rootProject: null,
          }));
        });

        it('should return an empty object', async () => {
          await expect(
            checkAngularBuilders({
              packageManager,
              mainConfig: { framework: '@storybook/angular' },
            })
          ).resolves.toMatchObject({});
        });
      });
    });
  });
});
