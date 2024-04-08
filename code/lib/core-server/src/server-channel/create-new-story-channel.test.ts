import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStoryId, initCreateNewStoryChannel } from './create-new-story-channel';
import path from 'path';
import type { ChannelTransport } from '@storybook/channels';
import { Channel } from '@storybook/channels';
import { CREATE_NEW_STORYFILE, CREATE_NEW_STORYFILE_RESULT } from '@storybook/core-events';

vi.mock('@storybook/core-common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@storybook/core-common')>();
  return {
    ...actual,
    getProjectRoot: vi.fn().mockReturnValue(require('path').join(__dirname)),
  };
});

const mockFs = vi.hoisted(() => {
  return {
    writeFileSync: vi.fn(),
  };
});

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    default: {
      ...actual,
      writeFileSync: mockFs.writeFileSync,
    },
  };
});

describe('createNewStoryChannel', () => {
  const transport = { setHandler: vi.fn(), send: vi.fn() } satisfies ChannelTransport;
  const mockChannel = new Channel({ transport });
  const createNewStoryFileEventListener = vi.fn();

  beforeEach(() => {
    transport.setHandler.mockClear();
    transport.send.mockClear();
    createNewStoryFileEventListener.mockClear();
  });

  describe('getStoryId', () => {
    it('should return the storyId', async () => {
      const cwd = process.cwd();
      const options = {
        configDir: path.join(cwd, '.storybook'),
        presets: {
          apply: (val: string) => {
            if (val === 'stories') {
              return Promise.resolve(['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']);
            }
          },
        },
      } as any;
      const storyFilePath = path.join(cwd, 'src', 'components', 'stories', 'Page1.stories.ts');
      const exportedStoryName = 'Default';

      const storyId = await getStoryId(options, storyFilePath, exportedStoryName);

      expect(storyId).toBe('components-stories-page1--default');
    });

    it('should throw an error if the storyId cannot be calculated', async () => {
      const cwd = process.cwd();
      const options = {
        configDir: path.join(cwd, '.storybook'),
        presets: {
          apply: (val: string) => {
            if (val === 'stories') {
              return Promise.resolve(['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']);
            }
          },
        },
      } as any;
      const storyFilePath = path.join(cwd, 'not-covered-path', 'stories', 'Page1.stories.ts');
      const exportedStoryName = 'Default';

      await expect(() =>
        getStoryId(options, storyFilePath, exportedStoryName)
      ).rejects.toThrowError();
    });
  });

  describe('initCreateNewStoryChannel', () => {
    it('should emit an event with a story id', async () => {
      mockChannel.addListener(CREATE_NEW_STORYFILE_RESULT, createNewStoryFileEventListener);
      const cwd = process.cwd();

      initCreateNewStoryChannel(mockChannel, {
        configDir: path.join(cwd, '.storybook'),
        presets: {
          apply: (val: string) => {
            if (val === 'framework') {
              return Promise.resolve('@storybook/nextjs');
            }
            if (val === 'stories') {
              return Promise.resolve(['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']);
            }
          },
        },
      } as any);

      mockChannel.emit(CREATE_NEW_STORYFILE, {
        filepath: 'src/components/Page.jsx',
        componentExportName: 'Page',
        default: true,
      });

      await vi.waitFor(() => {
        expect(createNewStoryFileEventListener).toHaveBeenCalled();
      });

      expect(createNewStoryFileEventListener).toHaveBeenCalledWith({
        error: null,
        result: {
          storyId: 'server-channel-src-components-page--default',
        },
        success: true,
      });
    });

    it('should emit an error event if an error occurs', async () => {
      mockChannel.addListener(CREATE_NEW_STORYFILE_RESULT, createNewStoryFileEventListener);
      const cwd = process.cwd();

      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Failed to write file');
      });

      initCreateNewStoryChannel(mockChannel, {
        configDir: path.join(cwd, '.storybook'),
        presets: {
          apply: (val: string) => {
            if (val === 'framework') {
              return Promise.resolve('@storybook/nextjs');
            }
            if (val === 'stories') {
              return Promise.resolve(['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']);
            }
          },
        },
      } as any);

      mockChannel.emit(CREATE_NEW_STORYFILE, {
        filepath: 'src/components/Page.jsx',
        componentExportName: 'Page',
        default: true,
      });

      await vi.waitFor(() => {
        expect(createNewStoryFileEventListener).toHaveBeenCalled();
      });

      expect(createNewStoryFileEventListener).toHaveBeenCalledWith({
        error: 'An error occurred while creating a new story:\nFailed to write file',
        result: null,
        success: false,
      });
    });
  });
});
