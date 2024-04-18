export interface CreateNewStoryPayload {
  // The filepath of the component for which the Story should be generated for (relative to the project root)
  componentFilePath: string;
  // The name of the exported component
  componentExportName: string;
  // is default export
  componentIsDefaultExport: boolean;
}

export interface CreateNewStoryResult {
  success: true | false;
  result: null | {
    storyId: string;
    storyFilePath: string;
    exportedStoryName: string;
  };
  error: null | string;
}
