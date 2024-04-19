import React, { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ComponentIcon } from '@storybook/icons';
import { FileSearchListLoadingSkeleton } from './FileSearchListSkeleton';
import {
  ChevronDownIconStyled,
  ChevronRightIconStyled,
  DefaultExport,
  FileList,
  FileListExport,
  FileListIconWrapper,
  FileListItem,
  FileListItemContent,
  FileListItemContentWrapper,
  FileListItemExport,
  FileListItemExportName,
  FileListItemExportNameContent,
  FileListItemLabel,
  FileListItemPath,
  FileListLi,
  FileListUl,
  FileListWrapper,
  NoResults,
  NoResultsDescription,
} from './FileList';
import type { VirtualItem } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CreateNewStoryPayload, FileComponentSearchResult } from '@storybook/core-events';
import { WithTooltip, TooltipNote } from '@storybook/components';

export type SearchResult = FileComponentSearchResult['result']['files'][0];

export interface NewStoryPayload extends CreateNewStoryPayload {
  selectedItemId: string | number;
}

interface FileSearchListProps {
  isLoading: boolean;
  searchResults: Array<SearchResult> | null;
  onNewStory: (props: NewStoryPayload) => void;
  errorItemId?: number | string;
}

interface FileItemContentProps {
  virtualItem: VirtualItem;
  selected: number | null;
  searchResult: SearchResult;
  as?: 'div';
}

interface FileItemSelectionPayload {
  virtualItem: VirtualItem;
  searchResult: SearchResult;
  itemId: string;
}

interface FileItemComponentSelectionPayload {
  searchResult: SearchResult;
  component: SearchResult['exportedComponents'][0];
  id: string;
}

export const FileSearchList = memo(function FileSearchList({
  isLoading,
  searchResults,
  onNewStory,
  errorItemId,
}: FileSearchListProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const parentRef = React.useRef();

  const sortedSearchResults = useMemo(() => {
    // search results with no exports should be at the end of the list
    return [...(searchResults ?? [])]?.sort((a, b) => {
      const isADisabled =
        a.exportedComponents === null ||
        a.exportedComponents?.length === 0 ||
        (a.storyFileExists && a.exportedComponents?.length < 2);

      const isBDisabled =
        b.exportedComponents === null ||
        b.exportedComponents?.length === 0 ||
        (b.storyFileExists && b.exportedComponents?.length < 2);

      if (isADisabled && !isBDisabled) {
        return 1;
      }

      if (!isADisabled && isBDisabled) {
        return -1;
      }

      return 0;
    });
  }, [searchResults]);

  const rowVirtualizer = useVirtualizer({
    count: searchResults?.length || 0,
    getScrollElement: () => parentRef.current,
    paddingStart: 16,
    paddingEnd: 40,
    estimateSize: () => 54,
    overscan: 2,
  });

  useLayoutEffect(() => {
    if (selectedItem !== null) {
      rowVirtualizer.scrollToIndex(selectedItem, {
        align: 'start',
      });
    }
  }, [rowVirtualizer, selectedItem]);

  const handleFileItemSelection = useCallback(
    ({ virtualItem, searchResult, itemId }: FileItemSelectionPayload) => {
      if (searchResult?.exportedComponents?.length > 1) {
        setSelectedItem((sItem) => {
          if (sItem === virtualItem.index) {
            return null;
          }

          return virtualItem.index;
        });
      } else if (searchResult?.exportedComponents?.length === 1 && !searchResult?.storyFileExists) {
        onNewStory({
          componentExportName: searchResult.exportedComponents[0].name,
          componentFilePath: searchResult.filepath,
          componentIsDefaultExport: searchResult.exportedComponents[0].default,
          selectedItemId: itemId,
        });
      }
    },
    [onNewStory]
  );

  const handleFileItemComponentSelection = useCallback(
    ({ searchResult, component, id }: FileItemComponentSelectionPayload) => {
      onNewStory({
        componentExportName: component.name,
        componentFilePath: searchResult.filepath,
        componentIsDefaultExport: component.default,
        selectedItemId: id,
      });
    },
    [onNewStory]
  );

  const ListItem = useCallback(
    ({ virtualItem, selected, searchResult, as }: FileItemContentProps) => {
      const itemError = errorItemId === searchResult.filepath;
      const itemSelected = selected === virtualItem.index;

      return (
        <FileListItem
          aria-expanded={itemSelected}
          aria-controls={`file-list-export-${virtualItem.index}`}
          id={`file-list-item-wrapper-${virtualItem.index}`}
          onClick={(event) => {
            handleFileItemSelection({ virtualItem, itemId: searchResult.filepath, searchResult });
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              handleFileItemSelection({ virtualItem, itemId: searchResult.filepath, searchResult });
            }
          }}
        >
          <FileListItemContentWrapper
            selected={itemSelected}
            error={itemError}
            disabled={
              searchResult.exportedComponents === null ||
              searchResult.exportedComponents?.length === 0 ||
              (searchResult.storyFileExists && searchResult.exportedComponents?.length < 2)
            }
          >
            <FileListIconWrapper error={itemError}>
              <ComponentIcon />
            </FileListIconWrapper>
            <FileListItemContent>
              <FileListItemLabel error={itemError}>
                {searchResult.filepath.split('/').at(-1)}
              </FileListItemLabel>
              <FileListItemPath>{searchResult.filepath}</FileListItemPath>
            </FileListItemContent>
            {itemSelected ? <ChevronDownIconStyled /> : <ChevronRightIconStyled />}
          </FileListItemContentWrapper>
          {searchResult?.exportedComponents?.length > 1 && itemSelected && (
            <FileListExport
              role="region"
              id={`file-list-export-${virtualItem.index}`}
              aria-labelledby={`file-list-item-wrapper-${virtualItem.index}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
            >
              {searchResult.exportedComponents?.map((component, itemExportId) => {
                const itemExportError = errorItemId === `${searchResult.filepath}_${itemExportId}`;
                return (
                  <FileListItemExport
                    tabIndex={0}
                    key={component.name}
                    error={itemExportError}
                    onClick={() => {
                      handleFileItemComponentSelection({
                        searchResult,
                        component,
                        id: `${searchResult.filepath}_${itemExportId}`,
                      });
                    }}
                    onKeyUp={(event) => {
                      if (event.key === 'Enter') {
                        handleFileItemComponentSelection({
                          searchResult,
                          component,
                          id: `${searchResult.filepath}_${itemExportId}`,
                        });
                      }
                    }}
                  >
                    <FileListItemExportName>
                      <ComponentIcon />
                      {component.default ? (
                        <>
                          <FileListItemExportNameContent>
                            {searchResult.filepath.split('/').at(-1)?.split('.')?.at(0)}
                          </FileListItemExportNameContent>
                          <DefaultExport>Default export</DefaultExport>
                        </>
                      ) : (
                        component.name
                      )}
                    </FileListItemExportName>
                    <ChevronRightIconStyled />
                  </FileListItemExport>
                );
              })}
            </FileListExport>
          )}
        </FileListItem>
      );
    },
    [handleFileItemComponentSelection, handleFileItemSelection, errorItemId]
  );

  if (isLoading && (searchResults === null || searchResults?.length === 0)) {
    return <FileSearchListLoadingSkeleton />;
  }

  if (searchResults?.length === 0) {
    return (
      <NoResults>
        <p>We could not find any file with that name</p>
        <NoResultsDescription>
          You may want to try using different keywords, checking for typos or adjusting your
          filters.
        </NoResultsDescription>
      </NoResults>
    );
  }

  if (sortedSearchResults?.length > 0) {
    return (
      <FileListWrapper>
        <FileList ref={parentRef}>
          <FileListUl
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const searchResult = sortedSearchResults[virtualItem.index];
              const noExports =
                searchResult.exportedComponents === null ||
                searchResult.exportedComponents?.length === 0;
              const hasStoryFile =
                searchResult.exportedComponents?.length === 1 && searchResult.storyFileExists;

              const itemProps = {};

              return (
                <FileListLi
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  tabIndex={0}
                >
                  {noExports || hasStoryFile ? (
                    <WithTooltip
                      {...itemProps}
                      style={{ width: '100%' }}
                      hasChrome={false}
                      closeOnOutsideClick={true}
                      tooltip={
                        <TooltipNote
                          note={
                            noExports
                              ? "We can't evaluate exports for this file. You can't create a story for it automatically"
                              : hasStoryFile
                                ? 'A story already exists for this file'
                                : null
                          }
                        />
                      }
                    >
                      <ListItem
                        searchResult={searchResult}
                        selected={selectedItem}
                        virtualItem={virtualItem}
                      />
                    </WithTooltip>
                  ) : (
                    <ListItem
                      {...itemProps}
                      key={virtualItem.index}
                      searchResult={searchResult}
                      selected={selectedItem}
                      virtualItem={virtualItem}
                    />
                  )}
                </FileListLi>
              );
            })}
          </FileListUl>
        </FileList>
      </FileListWrapper>
    );
  }

  return null;
});
