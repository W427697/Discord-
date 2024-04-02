import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { FILE_COMPONENT_SEARCH, FILE_COMPONENT_SEARCH_RESULT } from './constants';

enum ErrorCode {}

interface Data {
  // A regular string or a glob pattern
  searchQuery: string;
}

interface SearchResult {
  success: true | false;
  files: Array<{
    // The filepath relative to the project root
    filepath: string;
    // The search query - Helps to identify the event on the frontend
    searchQuery: string;
    // A list of exported components
    exportedComponents: Array<{
      // the name of the exported component
      name: string;
      // True, if the exported component is a default export
      default: boolean;
    }>;
  }>;
  error: null | ErrorCode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_serverChannel = async (channel: Channel, options: Options) => {
  channel.on(FILE_COMPONENT_SEARCH, async (data: Data) => {
    // Emit an event using the search results
    channel.emit(FILE_COMPONENT_SEARCH_RESULT, { result: {} as SearchResult });
  });

  return channel;
};
