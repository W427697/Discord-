import React, { useMemo, useRef } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea, Spaced } from '@storybook/components';
import type { State } from '@storybook/manager-api';

import type { API_LoadedRefData } from 'lib/types/src';
import type { TransitionStatus } from 'react-transition-group';
import { Transition } from 'react-transition-group';
import { Heading } from './Heading';

// eslint-disable-next-line import/no-cycle
import { Explorer } from './Explorer';
// eslint-disable-next-line import/no-cycle
import { Search } from './Search';
// eslint-disable-next-line import/no-cycle
import { SearchResults } from './SearchResults';
import type { Refs, CombinedDataset, Selection } from './types';
import { useLastViewed } from './useLastViewed';
import { useLayout } from '../layout/_context';

export const DEFAULT_REF_ID = 'storybook_internal';

const Container = styled.nav<{ state: TransitionStatus | null; transitionDuration: number }>(
  ({ state, transitionDuration }) => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    transition: `all ${transitionDuration}ms ease-in-out`,
    opacity: `${(() => {
      if (state === 'entered') return 1;
      if (state === 'entering') return 1;
      if (state === 'exiting') return 0;
      if (state === 'exited') return 0;
      return 1;
    })()}`,
    transform: `${(() => {
      if (state === 'entering') return 'translateX(0)';
      if (state === 'entered') return 'translateX(0)';
      if (state === 'exiting') return 'translateX(-20px)';
      if (state === 'exited') return 'translateX(-20px)';
      return 'translateX(0)';
    })()}`,
  })
);

const StyledSpaced = styled(Spaced)({
  paddingBottom: '2.5rem',
});

const CustomScrollArea = styled(ScrollArea)({
  '&&&&& .os-scrollbar-handle:before': {
    left: -12,
  },
  '&&&&& .os-scrollbar-vertical': {
    right: 5,
  },
  padding: 20,
});

const Swap = React.memo(function Swap({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  const [a, b] = React.Children.toArray(children);
  return (
    <>
      <div style={{ display: condition ? 'block' : 'none' }}>{a}</div>
      <div style={{ display: condition ? 'none' : 'block' }}>{b}</div>
    </>
  );
});

const useCombination = (
  defaultRefData: API_LoadedRefData & { status: State['status'] },
  refs: Refs
): CombinedDataset => {
  const hash = useMemo(
    () => ({
      [DEFAULT_REF_ID]: {
        ...defaultRefData,
        title: null,
        id: DEFAULT_REF_ID,
        url: 'iframe.html',
      },
      ...refs,
    }),
    [refs, defaultRefData]
  );
  return useMemo(() => ({ hash, entries: Object.entries(hash) }), [hash]);
};

export interface SidebarProps extends API_LoadedRefData {
  refs: State['refs'];
  status: State['status'];
  menu: any[];
  storyId?: string;
  refId?: string;
  menuHighlighted?: boolean;
  enableShortcuts?: boolean;
}

export const Sidebar = React.memo(function Sidebar({
  storyId = null,
  refId = DEFAULT_REF_ID,
  index,
  indexError,
  status,
  previewInitialized,
  menu,
  menuHighlighted = false,
  enableShortcuts = true,
  refs = {},
}: SidebarProps) {
  const selected: Selection = useMemo(() => storyId && { storyId, refId }, [storyId, refId]);
  const dataset = useCombination({ index, indexError, previewInitialized, status }, refs);
  const isLoading = !index && !indexError;
  const lastViewedProps = useLastViewed(selected);
  const { isMobile, isMobileAboutOpen, transitionDuration } = useLayout();
  const containerRef = useRef(null);

  return (
    <Transition nodeRef={containerRef} in={!isMobileAboutOpen} timeout={transitionDuration}>
      {(state) => (
        <Container
          ref={containerRef}
          className="container sidebar-container"
          state={isMobile ? state : null}
          transitionDuration={transitionDuration}
        >
          <CustomScrollArea vertical>
            <StyledSpaced row={1.6}>
              <Heading
                className="sidebar-header"
                menuHighlighted={menuHighlighted}
                menu={menu}
                skipLinkHref="#storybook-preview-wrapper"
              />

              <Search
                dataset={dataset}
                isLoading={isLoading}
                enableShortcuts={enableShortcuts}
                {...lastViewedProps}
              >
                {({
                  query,
                  results,
                  isBrowsing,
                  closeMenu,
                  getMenuProps,
                  getItemProps,
                  highlightedIndex,
                }) => (
                  <Swap condition={isBrowsing}>
                    <Explorer
                      dataset={dataset}
                      selected={selected}
                      isLoading={isLoading}
                      isBrowsing={isBrowsing}
                    />
                    <SearchResults
                      query={query}
                      results={results}
                      closeMenu={closeMenu}
                      getMenuProps={getMenuProps}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      enableShortcuts={enableShortcuts}
                      isLoading={isLoading}
                    />
                  </Swap>
                )}
              </Search>
            </StyledSpaced>
          </CustomScrollArea>
        </Container>
      )}
    </Transition>
  );
});
