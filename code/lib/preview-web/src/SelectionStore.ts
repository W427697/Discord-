/* eslint-disable camelcase */
import type { Store_SelectionSpecifier, Store_Selection } from '@storybook/types';

export abstract class SelectionStore {
  public selectionSpecifier: Store_SelectionSpecifier | null = null;

  public selection?: Store_Selection;

  abstract setSelection(selection: Store_Selection): void;

  abstract setQueryParams(queryParams: qs.ParsedQs): void;
}
