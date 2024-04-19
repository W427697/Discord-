export interface FileComponentSearchPayload {
  // A regular string or a glob pattern
  searchQuery?: string;
}

export interface FileComponentSearchResult {
  success: true | false;
  result: null | {
    // The search query - Helps to identify the event on the frontend
    searchQuery: string;
    files: Array<{
      // The filepath relative to the project root
      filepath: string;
      // Whether a corresponding story file exists
      storyFileExists: boolean;
      // A list of exported components
      exportedComponents: Array<{
        // the name of the exported component
        name: string;
        // True, if the exported component is a default export
        default: boolean;
      }> | null;
    }> | null;
  };
  error: null | string;
}
