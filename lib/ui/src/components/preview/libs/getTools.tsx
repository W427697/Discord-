import React, { Fragment } from 'react';
import window from 'global';
import copy from 'copy-to-clipboard';
import memoize from 'memoizerific';
import { types } from '@storybook/addons';
import { styled } from '@storybook/theming';
import { Icons, IconButton, TabButton, TabBar, Separator } from '@storybook/components';
import { ZoomConsumer, Zoom } from '../zoom';
import { BackgroundConsumer } from '../background';
import { stringifyQueryParams } from './stringifyQueryParams';
import * as S from '../components';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

/**
 * FOUNDATION TYPES
 * TODO: below is not strictly typed yet
 */
export interface StorybookUIElement {
  id: string;
  title?: string;
  route?: (props: any) => string;
  active?: (props: any) => boolean;
  match?: (props: any) => boolean;
  render: (props: any) => React.ReactNode;
}

/**
 * HELPERS
 */
export const getElementList = memoize(10)((getFn, type, base) =>
  base.concat(Object.values(getFn(type)))
);

type matchViewMode = (mode: string) => (arg: { viewMode: string }) => boolean;
const matchOnViewMode: matchViewMode = mode => ({ viewMode }) => viewMode === mode;

/**
 * Components extraction
 * TODO: components below would get typed and be pull out from the current file eventually.
 */
const TabsTool = ({ panels, storyId, viewMode, path, location }) => (
  <>
    <TabBar key="tabs" {...{ scroll: false } as any}>
      {panels.map((t, index) => {
        const to = t.route({ storyId, viewMode, path, location });
        const isActive = t.match({ storyId, viewMode, path, location });
        return (
          <S.UnstyledLink key={t.id || `l${index}`} to={to}>
            <TabButton active={isActive}>{t.title}</TabButton>
          </S.UnstyledLink>
        );
      })}
    </TabBar>
    <Separator />
  </>
);

const ZoomTool = () => (
  <>
    <ZoomConsumer>
      {({ set, value }) => (
        <Zoom key="zoom" current={value} set={v => set(value * v)} reset={() => set(1)} />
      )}
    </ZoomConsumer>
    <Separator />
  </>
);

const BackgroundTool = () => (
  <BackgroundConsumer>
    {({ setGrid, grid }) => (
      <IconButton
        active={!!grid}
        key="grid"
        onClick={() => setGrid(!grid)}
        title="Toggle background grid"
      >
        <Icons icon="grid" />
      </IconButton>
    )}
  </BackgroundConsumer>
);

const FullscreenTool = ({ api, options }) => (
  <DesktopOnly>
    <IconButton
      key="full"
      onClick={api.toggleFullscreen}
      title={options.isFullscreen ? 'Exit full screen' : 'Go full screen'}
    >
      <Icons icon={options.isFullscreen ? 'close' : 'expand'} />
    </IconButton>
  </DesktopOnly>
);

const OpenCanvasTool = ({ src }) => (
  <IconButton key="opener" onClick={() => window.open(src)} title="Open canvas in new tab">
    <Icons icon="share" />
  </IconButton>
);

const CopyLinkTool = ({ src }) => (
  <IconButton
    key="copy"
    onClick={() => copy(`${window.location.origin}${window.location.pathname}${src}`)}
    title="Copy canvas link"
  >
    <Icons icon="copy" />
  </IconButton>
);

/**
 * Extracted logic
 */
export const getTools = memoize(10)(
  ({
    getElements,
    queryParams,
    panels,
    api,
    options,
    storyId,
    viewMode,
    location,
    path,
    baseUrl,
  }) => {
    const src = `${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`;
    const storyMetaProps = { src, storyId, viewMode, location, path };

    // 'TOOL'
    const leftTools = getElementList(getElements, types.TOOL, [
      {
        id: 'tool-left-tabs',
        match: () => panels.length > 1, // display tabs only when there are more than 1 (i.e. canvas) panels
        render: () => <TabsTool panels={panels} {...storyMetaProps} />,
      },
      {
        id: 'tool-left-zoom',
        match: matchOnViewMode('story'),
        render: () => <ZoomTool />,
      },
      {
        id: 'tool-left-background',
        match: matchOnViewMode('story'),
        render: () => <BackgroundTool />,
      },
    ]);

    // TODO: add 'TOOLEXTRA' in 'storybook@types'
    // 'TOOLEXTRA'
    const rightTools = getElementList(getElements, (types as any).TOOLEXTRA, [
      {
        id: 'tool-right-fullscreen',
        match: matchOnViewMode('story'),
        render: () => <FullscreenTool api={api} options={options} />,
      },
      {
        id: 'tool-right-open-iframe',
        match: matchOnViewMode('story'),
        render: () => <OpenCanvasTool src={src} />,
      },
      {
        id: 'tool-right-copy-link',
        match: matchOnViewMode('story'),
        render: () => <CopyLinkTool src={src} />,
      },
    ]);

    type renderTools = (elements: StorybookUIElement[]) => React.ReactNodeArray;
    const renderTools: renderTools = elements =>
      elements
        // if no matching function provide, default to matched, active (= true)
        .filter(({ match = () => true }) => match(storyMetaProps))
        .map(({ render, id }, index) => (
          <Fragment key={id || `f-${index}`}>{render(storyMetaProps)}</Fragment>
        ));

    const left = renderTools(leftTools);
    const right = renderTools(rightTools);

    return { left, right };
  }
);
