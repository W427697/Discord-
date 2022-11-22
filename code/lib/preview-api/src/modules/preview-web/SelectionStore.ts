import type { Store_StorySpecifier, ViewMode, Args, StoryId } from '@storybook/types';

export interface SelectionSpecifier {
  storySpecifier: Store_StorySpecifier;
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
