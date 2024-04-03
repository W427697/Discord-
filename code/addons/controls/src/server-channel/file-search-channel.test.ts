import type { ChannelTransport } from '@storybook/channels';
import { Channel } from '@storybook/channels';
import { FILE_COMPONENT_SEARCH, FILE_COMPONENT_SEARCH_RESULT } from '../constants';
import { initFileSearchChannel } from './file-search-channel';
import { beforeEach, describe, expect, vi, it } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    searchFiles: vi.fn(),
  };
});

vi.mock('../utils/filesearch', () => {
  return {
    searchFiles: mocks.searchFiles,
  };
});

vi.mock('@storybook/core-common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@storybook/core-common')>();
  return {
    ...actual,
    getFrameworkName: vi.fn().mockResolvedValue('@storybook/react'),
    extractProperRendererNameFromFramework: vi.fn().mockResolvedValue('react'),
    getProjectRoot: vi
      .fn()
      .mockReturnValue(require('path').join(__dirname, '..', 'utils', '__tests__')),
  };
});

describe('file-search-channel', () => {
  const transport = { setHandler: vi.fn(), send: vi.fn() } satisfies ChannelTransport;
  const mockChannel = new Channel({ transport });
  const searchResultChannelListener = vi.fn();

  beforeEach(() => {
    transport.setHandler.mockClear();
    transport.send.mockClear();
    searchResultChannelListener.mockClear();
  });

  describe('initFileSearchChannel', async () => {
    it('should emit search result event with the search result', async () => {
      const mockOptions = {};
      const data = { searchQuery: 'commonjs' };

      initFileSearchChannel(mockChannel, mockOptions as any);

      mockChannel.addListener(FILE_COMPONENT_SEARCH_RESULT, searchResultChannelListener);
      mockChannel.emit(FILE_COMPONENT_SEARCH, data);

      mocks.searchFiles.mockImplementation(async (...args) => {
        // @ts-expect-error Ignore type issue
        return (await vi.importActual('../utils/filesearch')).searchFiles(...args);
      });

      await vi.waitFor(() => {
        expect(searchResultChannelListener).toHaveBeenCalled();
      });

      expect(searchResultChannelListener).toHaveBeenCalledWith({
        error: null,
        result: {
          files: [
            {
              exportedComponents: [
                {
                  default: false,
                  name: './commonjs',
                },
              ],
              filepath: 'src/commonjs-default.js',
            },
            {
              exportedComponents: [
                {
                  default: false,
                  name: 'a',
                },
                {
                  default: false,
                  name: 'b',
                },
                {
                  default: false,
                  name: 'c',
                },
                {
                  default: false,
                  name: 'd',
                },
                {
                  default: false,
                  name: 'e',
                },
              ],
              filepath: 'src/commonjs.js',
            },
          ],
          searchQuery: 'commonjs',
        },
        success: true,
      });
    });

    it('should emit an error message if an error occurs while searching for components in the project', async () => {
      const mockOptions = {};
      const data = { searchQuery: 'commonjs' };

      initFileSearchChannel(mockChannel, mockOptions as any);

      mockChannel.addListener(FILE_COMPONENT_SEARCH_RESULT, searchResultChannelListener);

      mockChannel.emit(FILE_COMPONENT_SEARCH, data);

      mocks.searchFiles.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      await vi.waitFor(() => {
        expect(searchResultChannelListener).toHaveBeenCalled();
      });

      expect(searchResultChannelListener).toHaveBeenCalledWith({
        error:
          'An error occurred while searching for components in the project.\nENOENT: no such file or directory',
        result: null,
        success: false,
      });
    });
  });
});
