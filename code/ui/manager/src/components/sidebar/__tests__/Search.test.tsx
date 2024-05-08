import { type Mock, beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as api from '@storybook/manager-api';
import { ThemeProvider, themes, convert } from '@storybook/theming';

import { FILTER_KEY, Search } from '../Search';
import type {
  CombinedDataset,
  SearchChildrenFn,
  Selection,
} from '../types';

const FILTER_VALUE = 'filter';
const PLACEHOLDER = 'Find components';

const renderSearch = (props?: Partial<Parameters<typeof Search>[0]>) => {
  const dataset: CombinedDataset = {
    hash: {},
    entries: []
  };
  const getLastViewed = (): Selection[] => [];
  const children: SearchChildrenFn = () => (
    <></>
  );
  render(
    <ThemeProvider theme={convert(themes.light)}>
      <Search
        {...({
          dataset,
          getLastViewed,
          children,
          ...props
        })}
      >
      </Search>
    </ThemeProvider>
  );
};

vi.mock('@storybook/manager-api');

describe('Search', () => {
  let setQueryParams: Mock;
  let getQueryParams: Mock;
  let queryParams: Record<string, string>;

  beforeEach(() => {
    vi.mocked(api.useStorybookApi).mockReset();
    queryParams = {};
    setQueryParams = vi.fn((params) => {
      queryParams = params;
    });
    getQueryParams = vi.fn(() => queryParams);
    const mockApi: Partial<api.API> = {
      setQueryParams,
      getQueryParams,
      getShortcutKeys: () => ({
        aboutPage: [],
        collapseAll: [],
        escape: [],
        expandAll: [],
        focusIframe: [],
        focusNav: [],
        focusPanel: [],
        fullScreen: [],
        nextComponent: [],
        nextStory: [],
        panelPosition: [],
        prevComponent: [],
        prevStory: [],
        remount: [],
        search: [],
        shortcutsPage: [],
        toggleNav: [],
        togglePanel: [],
        toolbar: []
      })
    };
    vi.mocked(api.useStorybookApi).mockReturnValue(mockApi as any);
    vi.mocked(api.useStorybookState).mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders OK', async () => {
    renderSearch();
    const INPUT = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement;
    expect(INPUT.value).toBe('');
  });

  test('prefills input with initial query', async () => {
    const state: Partial<api.State> = {
      storyId: 'jest',
      customQueryParams: {
        [FILTER_KEY]: 'filter',
      },
      ui: { enableShortcuts: true },
    };
    vi.mocked(api.useStorybookState).mockReturnValue(state as any);
    renderSearch({initialQuery: FILTER_VALUE});
    const INPUT = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement;
    expect(INPUT.value).toBe(FILTER_VALUE);
    expect(setQueryParams).not.toHaveBeenCalled();
    expect(queryParams).toEqual({});
  });

  test('updates location on input update with current query', async () => {
    renderSearch({initialQuery: 'foo'});
    const INPUT = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement;
    await act(async () => {
      await userEvent.clear(INPUT);
      await userEvent.type(INPUT, FILTER_VALUE);
    });
    expect(setQueryParams).toHaveBeenCalled();
    expect(queryParams).toEqual({
      [FILTER_KEY]: FILTER_VALUE
    });
  });

  test('updates location on input update without current query', async () => {
    renderSearch();
    const INPUT = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement;
    await act(async () => {
      await userEvent.clear(INPUT);
      await userEvent.type(INPUT, FILTER_VALUE);
    });
    expect(setQueryParams).toHaveBeenCalled();
    expect(queryParams).toEqual({
      [FILTER_KEY]: FILTER_VALUE
    });
  });
});
