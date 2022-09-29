import { fdir as FDir } from 'fdir';
import { logger } from '@storybook/node-logger';
import { warn } from './warn';

jest.mock('@storybook/node-logger');
const syncMock = jest.fn();
const crawlerMock = jest.fn().mockImplementation(() => {
  return {
    sync: syncMock,
  };
});
jest.spyOn(FDir.prototype, 'crawl').mockImplementation(crawlerMock);

describe('warn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      syncMock.mockReturnValueOnce({ files: 0 });
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(0);
    });

    it('should warn if `.tsx?` files are found', () => {
      syncMock.mockReturnValueOnce({ files: 1 });
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
