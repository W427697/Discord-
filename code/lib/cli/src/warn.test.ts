import { describe, beforeEach, it, expect, vi } from 'vitest';
import { logger } from '@storybook/core/dist/node-logger';
import { warn } from './warn';

vi.mock('@storybook/core/dist/node-logger');

const mocks = vi.hoisted(() => {
  return {
    globby: vi.fn(),
  };
});

vi.mock('globby', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('globby')>()),
    globby: mocks.globby,
  };
});

describe('warn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when TypeScript is installed as a dependency', () => {
    it('should not warn', () => {
      warn({
        hasTSDependency: true,
      });
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });

  describe('when TypeScript is not installed as a dependency', () => {
    it('should not warn if `.tsx?` files are not found', async () => {
      mocks.globby.mockResolvedValue([]);
      await warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(0);
    });

    it('should warn if `.tsx?` files are found', async () => {
      mocks.globby.mockResolvedValue(['a.ts']);
      await warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
