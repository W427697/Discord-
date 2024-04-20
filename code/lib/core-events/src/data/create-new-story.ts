export interface CreateNewStoryRequestPayload {
  // The filepath of the component for which the Story should be generated for (relative to the project root)
  componentFilePath: string;
  // The name of the exported component
  componentExportName: string;
  // is default export
  componentIsDefaultExport: boolean;
  // The amount of exports in the file
  componentExportCount: number;
}

export interface CreateNewStoryResponsePayload {
  storyId: string;
  storyFilePath: string;
  exportedStoryName: string;
}
