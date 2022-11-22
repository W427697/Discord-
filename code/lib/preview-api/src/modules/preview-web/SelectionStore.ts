import type { PreparedStorySpecifier, ViewMode, Args, StoryId } from '@storybook/types';

export interface SelectionSpecifier {
  storySpecifier: PreparedStorySpecifier;
  viewMode: ViewMode;
  args?: Args;
  globals?: Args;
}

export interface Selection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export interface SelectionStore {
  selectionSpecifier: SelectionSpecifier | null;

  selection?: Selection;

  setSelection(selection: Selection): void;

  setQueryParams(queryParams: qs.ParsedQs): void;
}
