import { describe, beforeEach, it, expect, vi } from 'vitest';
import globby from 'globby';
import { logger } from '@storybook/core/dist/modules/node-logger/index';
import { warn } from './warn';

vi.mock('@storybook/core/dist/modules/node-logger/index');
vi.mock('globby');

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
    it('should not warn if `.tsx?` files are not found', () => {
      vi.mocked(globby.sync).mockReturnValueOnce([]);
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(0);
    });

    it('should warn if `.tsx?` files are found', () => {
      vi.mocked(globby.sync).mockReturnValueOnce(['a.ts']);
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
