import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import { styled } from '@storybook/theming';
import { ChevronDownIcon, ChevronRightIcon, ComponentIcon } from '@storybook/icons';
import { FileSearchListLoadingSkeleton } from './FileSearchListSkeleton';
import { FileList, FileListItem } from './FileList';
import type { VirtualItem } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CreateNewStoryPayload, FileComponentSearchResult } from '@storybook/core-events';
import { WithTooltip, TooltipNote } from '@storybook/components';

const FileListItemContentWrapper = styled.div<{ selected: boolean; disabled: boolean }>(
  ({ theme, selected, disabled }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    alignSelf: 'stretch',
    padding: '8px 16px',
    cursor: 'pointer',

    ...(selected && {
      borderRadius: '4px',
      background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : theme.color.mediumlight,

      '> svg': {
        display: 'flex',
      },
    }),

    ...(disabled && {
      cursor: 'not-allowed',
    }),

    '&:hover': {
      borderRadius: '4px',
      background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : theme.color.mediumlight,

      '> svg': {
        display: 'flex',
      },
    },
  })
);

const FileListUl = styled('ul')({
  margin: 0,
  padding: 0,
  width: '100%',
  position: 'relative',
});

const FileListItemContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: 'calc(100% - 50px)',
});

const FileListIconWrapper = styled('div')(({ theme }) => ({
  color: theme.color.secondary,
}));

const FileListItemLabel = styled('div')(({ theme }) => ({
  color: theme.base === 'dark' ? theme.color.lighter : theme.color.darkest,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
}));

const FileListItemPath = styled('div')(({ theme }) => ({
  color: theme.color.mediumdark,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
}));

const FileListExport = styled('ul')(({ theme }) => ({
  margin: 0,
  padding: 0,
}));

const FileListItemExport = styled('li')(({ theme }) => ({
  padding: '8px 16px 8px 16px',
  marginLeft: '30px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',

  ':focus-visible': {
    outline: 'none',
    borderRadius: '4px',
    background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : theme.color.mediumlight,

    '> svg': {
      display: 'flex',
    },
  },

  '&:hover': {
    borderRadius: '4px',
    background: theme.base === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.color.mediumlight,

    '> svg': {
      display: 'flex',
    },
  },

  '> div > svg': {
    color: theme.color.secondary,
  },
}));

const FileListItemExportName = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: 'calc(100% - 20px)',
}));

const FileListItemExportNameContent = styled('span')(({ theme }) => ({
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: 'calc(100% - 160px)',
  display: 'inline-block',
}));

const ChevronRightIconStyled = styled(ChevronRightIcon)(({ theme }) => ({
  display: 'none',
  alignSelf: 'center',
  color: theme.color.mediumdark,
}));

const ChevronDownIconStyled = styled(ChevronDownIcon)(({ theme }) => ({
  display: 'none',
  alignSelf: 'center',
  color: theme.color.mediumdark,
}));

const DefaultExport = styled('span')(({ theme }) => ({
  display: 'inline-block',
  padding: `1px ${theme.appBorderRadius}px`,
  color: '#727272',
  backgroundColor: '#F2F4F5',
}));

const NoResults = styled('div')(({ theme }) => ({
  padding: '0 10%',
  textAlign: 'center',
  color: theme.base === 'dark' ? theme.color.lightest : theme.defaultText,
}));

const NoResultsDescription = styled('p')(({ theme }) => ({
  color: theme.base === 'dark' ? theme.color.defaultText : theme.color.mediumdark,
}));

export type SearchResult = FileComponentSearchResult['result']['files'][0];

interface FileSearchListProps {
  isLoading: boolean;
  searchResults: Array<SearchResult> | null;
  onNewStory: (props: CreateNewStoryPayload) => void;
}

interface FileItemContentProps {
  virtualItem: VirtualItem;
  selected: number | null;
  searchResult: SearchResult;
  as?: 'div';
}

export const FileSearchList = memo(function FileSearchList({
  isLoading,
  searchResults,
  onNewStory,
}: FileSearchListProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: searchResults?.length || 0,
    getScrollElement: () => parentRef.current,
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
    ({ virtualItem, searchResult }: { virtualItem: VirtualItem; searchResult: SearchResult }) => {
      if (searchResult?.exportedComponents?.length > 1) {
        setSelectedItem((sItem) => {
          if (sItem === virtualItem.index) {
            return null;
          }

          return virtualItem.index;
        });
      } else if (searchResult?.exportedComponents?.length === 1) {
        onNewStory({
          componentExportName: searchResult.exportedComponents[0].name,
          componentFilePath: searchResult.filepath,
          componentIsDefaultExport: searchResult.exportedComponents[0].default,
        });
      }
    },
    [onNewStory]
  );

  const handleFileItemComponentSelection = useCallback(
    ({
      searchResult,
      component,
    }: {
      searchResult: SearchResult;
      component: SearchResult['exportedComponents'][0];
    }) => {
      onNewStory({
        componentExportName: component.name,
        componentFilePath: searchResult.filepath,
        componentIsDefaultExport: component.default,
      });
    },
    [onNewStory]
  );

  const ListItem = useCallback(
    ({ virtualItem, selected, searchResult, as }: FileItemContentProps) => (
      <FileListItem
        key={virtualItem.key}
        aria-expanded={selected === virtualItem.index}
        aria-controls={`file-list-export-${virtualItem.index}`}
        id={`file-list-item-wrapper-${virtualItem.index}`}
        as={as}
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
        onClick={(event) => {
          handleFileItemSelection({ virtualItem, searchResult });
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            handleFileItemSelection({ virtualItem, searchResult });
          }
        }}
      >
        <FileListItemContentWrapper
          selected={selected === virtualItem.index}
          disabled={
            searchResult.exportedComponents === null ||
            searchResult.exportedComponents?.length === 0
          }
        >
          <FileListIconWrapper>
            <ComponentIcon />
          </FileListIconWrapper>
          <FileListItemContent>
            <FileListItemLabel>{searchResult.filepath.split('/').at(-1)}</FileListItemLabel>
            <FileListItemPath>{searchResult.filepath}</FileListItemPath>
          </FileListItemContent>
          {selected === virtualItem.index ? <ChevronDownIconStyled /> : <ChevronRightIconStyled />}
        </FileListItemContentWrapper>
        {searchResult?.exportedComponents?.length > 1 && selected === virtualItem.index && (
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
            {searchResult.exportedComponents?.map((component) => (
              <FileListItemExport
                tabIndex={0}
                key={component.name}
                onClick={(event) => {
                  handleFileItemComponentSelection({ searchResult, component });
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    handleFileItemComponentSelection({ searchResult, component });
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
            ))}
          </FileListExport>
        )}
      </FileListItem>
    ),
    [handleFileItemComponentSelection, handleFileItemSelection, rowVirtualizer]
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

  if (searchResults?.length > 0) {
    return (
      <FileList ref={parentRef}>
        <FileListUl
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const searchResult = searchResults[virtualItem.index];
            return searchResult.exportedComponents === null ||
              searchResult.exportedComponents?.length === 0 ? (
              <WithTooltip
                key={virtualItem.index}
                as="li"
                hasChrome={false}
                closeOnOutsideClick={true}
                tooltip={
                  <TooltipNote note="We can't evaluate exports for this file. You can't create a story for it automatically" />
                }
              >
                <ListItem
                  as="div"
                  searchResult={searchResult}
                  selected={selectedItem}
                  virtualItem={virtualItem}
                  key={virtualItem.index}
                />
              </WithTooltip>
            ) : (
              <ListItem
                key={virtualItem.index}
                searchResult={searchResult}
                selected={selectedItem}
                virtualItem={virtualItem}
              />
            );
          })}
        </FileListUl>
      </FileList>
    );
  }

  return null;
});

// border-radius: 2px;
// font-size: 10px;

// apply font-size: 14px to sub items
// input sizing and icon positioning
