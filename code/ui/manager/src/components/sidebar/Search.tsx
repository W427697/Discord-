import { useStorybookApi, shortcutToHumanString } from '@storybook/manager-api';
import { styled } from '@storybook/core/dist/theming';
import type { DownshiftState, StateChangeOptions } from 'downshift';
import Downshift from 'downshift';
import type { FuseOptions } from 'fuse.js';
import Fuse from 'fuse.js';
import { global } from '@storybook/global';
import React, { useRef, useState, useCallback } from 'react';
import { CloseIcon, PlusIcon, SearchIcon } from '@storybook/icons';
import { IconButton, TooltipNote, WithTooltip } from '@storybook/components';
import { DEFAULT_REF_ID } from './Sidebar';
import type {
  CombinedDataset,
  SearchItem,
  SearchResult,
  DownshiftItem,
  SearchChildrenFn,
  Selection,
} from './types';
import { isSearchResult, isExpandType } from './types';

import { scrollIntoView, searchItem } from '../../utils/tree';
import { getGroupStatus, getHighestStatus } from '../../utils/status';
import { useLayout } from '../layout/LayoutProvider';
import { CreateNewStoryFileModal } from './CreateNewStoryFileModal';

const { document } = global;

const DEFAULT_MAX_SEARCH_RESULTS = 50;

const options = {
  shouldSort: true,
  tokenize: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'path', weight: 0.3 },
  ],
} as FuseOptions<SearchItem>;

const SearchBar = styled.div({
  display: 'flex',
  flexDirection: 'row',
  columnGap: 6,
});

const TooltipNoteWrapper = styled(TooltipNote)({
  margin: 0,
});

const ScreenReaderLabel = styled.label({
  position: 'absolute',
  left: -10000,
  top: 'auto',
  width: 1,
  height: 1,
  overflow: 'hidden',
});

const CreateNewStoryButton = styled(IconButton)(({ theme }) => ({
  color: theme.color.mediumdark,
}));

const SearchIconWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 8,
  zIndex: 1,
  pointerEvents: 'none',
  color: theme.textMutedColor,
  display: 'flex',
  alignItems: 'center',
  height: '100%',
}));

const SearchField = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
});

const Input = styled.input(({ theme }) => ({
  appearance: 'none',
  height: 28,
  paddingLeft: 28,
  paddingRight: 28,
  border: 0,
  boxShadow: `${theme.button.border} 0 0 0 1px inset`,
  background: 'transparent',
  borderRadius: 4,
  fontSize: `${theme.typography.size.s1 + 1}px`,
  fontFamily: 'inherit',
  transition: 'all 150ms',
  color: theme.color.defaultText,
  width: '100%',

  '&:focus, &:active': {
    outline: 0,
    borderColor: theme.color.secondary,
    background: theme.background.app,
  },
  '&::placeholder': {
    color: theme.textMutedColor,
    opacity: 1,
  },
  '&:valid ~ code, &:focus ~ code': {
    display: 'none',
  },
  '&:invalid ~ svg': {
    display: 'none',
  },
  '&:valid ~ svg': {
    display: 'block',
  },
  '&::-ms-clear': {
    display: 'none',
  },
  '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration':
    {
      display: 'none',
    },
}));

const FocusKey = styled.code(({ theme }) => ({
  position: 'absolute',
  top: 6,
  right: 9,
  height: 16,
  zIndex: 1,
  lineHeight: '16px',
  textAlign: 'center',
  fontSize: '11px',
  color: theme.base === 'light' ? theme.color.dark : theme.textMutedColor,
  userSelect: 'none',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

const FocusKeyCmd = styled.span({
  fontSize: '14px',
});

const ClearIcon = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 8,
  zIndex: 1,
  color: theme.textMutedColor,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
}));

const FocusContainer = styled.div({ outline: 0 });

const isDevelopment = global.CONFIG_TYPE === 'DEVELOPMENT';
const isRendererReact = global.STORYBOOK_RENDERER === 'react';

export const Search = React.memo<{
  children: SearchChildrenFn;
  dataset: CombinedDataset;
  enableShortcuts?: boolean;
  getLastViewed: () => Selection[];
  initialQuery?: string;
  showCreateStoryButton?: boolean;
}>(function Search({
  children,
  dataset,
  enableShortcuts = true,
  getLastViewed,
  initialQuery = '',
  showCreateStoryButton = isDevelopment && isRendererReact,
}) {
  const api = useStorybookApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputPlaceholder, setPlaceholder] = useState('Find components');
  const [allComponents, showAllComponents] = useState(false);
  const searchShortcut = api ? shortcutToHumanString(api.getShortcutKeys().search) : '/';
  const [isFileSearchModalOpen, setIsFileSearchModalOpen] = useState(false);

  const makeFuse = useCallback(() => {
    const list = dataset.entries.reduce<SearchItem[]>((acc, [refId, { index, status }]) => {
      const groupStatus = getGroupStatus(index || {}, status);

      if (index) {
        acc.push(
          ...Object.values(index).map((item) => {
            const statusValue =
              status && status[item.id]
                ? getHighestStatus(Object.values(status[item.id] || {}).map((s) => s.status))
                : null;
            return {
              ...searchItem(item, dataset.hash[refId]),
              status: statusValue || groupStatus[item.id] || null,
            };
          })
        );
      }
      return acc;
    }, []);
    return new Fuse(list, options);
  }, [dataset]);

  const getResults = useCallback(
    (input: string) => {
      const fuse = makeFuse();
      if (!input) return [];

      let results: DownshiftItem[] = [];
      const resultIds: Set<string> = new Set();
      const distinctResults = (fuse.search(input) as SearchResult[]).filter(({ item }) => {
        if (
          !(item.type === 'component' || item.type === 'docs' || item.type === 'story') ||
          resultIds.has(item.parent)
        )
          return false;
        resultIds.add(item.id);
        return true;
      });

      if (distinctResults.length) {
        results = distinctResults.slice(0, allComponents ? 1000 : DEFAULT_MAX_SEARCH_RESULTS);
        if (distinctResults.length > DEFAULT_MAX_SEARCH_RESULTS && !allComponents) {
          results.push({
            showAll: () => showAllComponents(true),
            totalCount: distinctResults.length,
            moreCount: distinctResults.length - DEFAULT_MAX_SEARCH_RESULTS,
          });
        }
      }

      return results;
    },
    [allComponents, makeFuse]
  );

  const onSelect = useCallback(
    (selectedItem: DownshiftItem) => {
      if (isSearchResult(selectedItem)) {
        const { id, refId } = selectedItem.item;
        api?.selectStory(id, undefined, { ref: refId !== DEFAULT_REF_ID && refId });
        inputRef.current.blur();
        showAllComponents(false);
        return;
      }
      if (isExpandType(selectedItem)) {
        selectedItem.showAll();
      }
    },
    [api]
  );

  const onInputValueChange = useCallback((inputValue: string, stateAndHelpers: any) => {
    showAllComponents(false);
  }, []);

  const stateReducer = useCallback(
    (state: DownshiftState<DownshiftItem>, changes: StateChangeOptions<DownshiftItem>) => {
      switch (changes.type) {
        case Downshift.stateChangeTypes.blurInput: {
          return {
            ...changes,
            // Prevent clearing the input on blur
            inputValue: state.inputValue,
            // Return to the tree view after selecting an item
            isOpen: state.inputValue && !state.selectedItem,
          };
        }

        case Downshift.stateChangeTypes.mouseUp: {
          // Prevent clearing the input on refocus
          return state;
        }

        case Downshift.stateChangeTypes.keyDownEscape: {
          if (state.inputValue) {
            // Clear the inputValue, but don't return to the tree view
            return { ...changes, inputValue: '', isOpen: true, selectedItem: null };
          }
          // When pressing escape a second time return to the tree view
          // The onKeyDown handler will also blur the input in this case
          return { ...changes, isOpen: false, selectedItem: null };
        }

        case Downshift.stateChangeTypes.clickItem:
        case Downshift.stateChangeTypes.keyDownEnter: {
          if (isSearchResult(changes.selectedItem)) {
            // Return to the tree view, but keep the input value
            return { ...changes, inputValue: state.inputValue };
          }
          if (isExpandType(changes.selectedItem)) {
            // Downshift should completely ignore this
            return state;
          }
          return changes;
        }

        default:
          return changes;
      }
    },
    []
  );
  const { isMobile } = useLayout();

  return (
    <Downshift<DownshiftItem>
      initialInputValue={initialQuery}
      stateReducer={stateReducer}
      // @ts-expect-error (Converted from ts-ignore)
      itemToString={(result) => result?.item?.name || ''}
      scrollIntoView={(e) => scrollIntoView(e)}
      onSelect={onSelect}
      onInputValueChange={onInputValueChange}
    >
      {({
        isOpen,
        openMenu,
        closeMenu,
        inputValue,
        clearSelection,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getRootProps,
        highlightedIndex,
      }) => {
        const input = inputValue ? inputValue.trim() : '';
        let results: DownshiftItem[] = input ? getResults(input) : [];

        const lastViewed = !input && getLastViewed();
        if (lastViewed && lastViewed.length) {
          results = lastViewed.reduce((acc, { storyId, refId }) => {
            const data = dataset.hash[refId];
            if (data && data.index && data.index[storyId]) {
              const story = data.index[storyId];
              const item = story.type === 'story' ? data.index[story.parent] : story;
              // prevent duplicates
              if (!acc.some((res) => res.item.refId === refId && res.item.id === item.id)) {
                acc.push({ item: searchItem(item, dataset.hash[refId]), matches: [], score: 0 });
              }
            }
            return acc;
          }, []);
        }

        const inputId = 'storybook-explorer-searchfield';
        const inputProps = getInputProps({
          id: inputId,
          ref: inputRef,
          required: true,
          type: 'search',
          placeholder: inputPlaceholder,
          onFocus: () => {
            openMenu();
            setPlaceholder('Type to find...');
          },
          onBlur: () => setPlaceholder('Find components'),
          onKeyDown: (e) => {
            if (e.key === 'Escape' && inputValue.length === 0) {
              // When pressing escape while the input is empty, blur the input
              // The stateReducer will handle returning to the tree view
              inputRef.current.blur();
            }
          },
        });

        const labelProps = getLabelProps({
          htmlFor: inputId,
        });

        return (
          <>
            <ScreenReaderLabel {...labelProps}>Search for components</ScreenReaderLabel>
            <SearchBar>
              <SearchField
                {...getRootProps({ refKey: '' }, { suppressRefError: true })}
                className="search-field"
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <Input {...inputProps} />
                {!isMobile && enableShortcuts && !isOpen && (
                  <FocusKey>
                    {searchShortcut === '⌘ K' ? (
                      <>
                        <FocusKeyCmd>⌘</FocusKeyCmd>K
                      </>
                    ) : (
                      searchShortcut
                    )}
                  </FocusKey>
                )}
                {isOpen && (
                  <ClearIcon onClick={() => clearSelection()}>
                    <CloseIcon />
                  </ClearIcon>
                )}
              </SearchField>
              {showCreateStoryButton && (
                <>
                  <WithTooltip
                    trigger="hover"
                    hasChrome={false}
                    tooltip={<TooltipNoteWrapper note="Create a new story" />}
                  >
                    <CreateNewStoryButton
                      onClick={() => {
                        setIsFileSearchModalOpen(true);
                      }}
                      variant="outline"
                    >
                      <PlusIcon />
                    </CreateNewStoryButton>
                  </WithTooltip>
                  <CreateNewStoryFileModal
                    open={isFileSearchModalOpen}
                    onOpenChange={setIsFileSearchModalOpen}
                  />
                </>
              )}
            </SearchBar>
            <FocusContainer tabIndex={0} id="storybook-explorer-menu">
              {children({
                query: input,
                results,
                isBrowsing: !isOpen && document.activeElement !== inputRef.current,
                closeMenu,
                getMenuProps,
                getItemProps,
                highlightedIndex,
              })}
            </FocusContainer>
          </>
        );
      }}
    </Downshift>
  );
});
