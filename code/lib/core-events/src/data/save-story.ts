export interface SaveStoryRequest {
  id: string;
  payload: {
    csfId: string;
    importPath: string;
    args: Record<string, any>;
    name?: string;
  };
}

export type SaveStoryResponse = (
  | { id: string; success: true }
  | { id: string; success: false; error: string }
) & {
  payload: {
    csfId: string;
    newStoryId?: string;
    newStoryName?: string;
    sourceFileName?: string;
    sourceStoryName?: string;
  };
};
