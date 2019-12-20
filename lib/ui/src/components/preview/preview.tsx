import window from 'global';
import React, { Component, Fragment, FunctionComponent } from 'react';
import memoize from 'memoizerific';
import copy from 'copy-to-clipboard';

import { styled } from '@storybook/theming';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';
import { Icons, IconButton, TabButton, TabBar, Separator } from '@storybook/components';

import { Helmet } from 'react-helmet-async';

import { API } from '@storybook/api';
import { Toolbar } from './toolbar';

import * as S from './components';

import { ZoomProvider, ZoomConsumer, Zoom } from './zoom';

import { IFrame } from './iframe';
import { ViewMode, ActualPreviewProps, Wrapper, PreviewProps, Panel } from './preview-types';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

const stringifyQueryParams = (queryParams: Record<string, any>): string =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');

const renderIframe = (
  viewMode: ViewMode,
  currentUrl: string,
  scale: number,
  queryParams: {},
  frames: Record<string, string> = {},
  storyId = ''
) => (
  <Fragment key="iframe">
    {Object.entries(frames).map(([id, url]) => (
      <IFrame
        key={id}
        id={id}
        isActive={url === currentUrl}
        data-is-storybook
        title={id || 'preview'}
        src={`${url}?id=${storyId}&viewMode=${viewMode}${stringifyQueryParams(queryParams)}`}
        allowFullScreen
        scale={scale}
      />
    ))}
  </Fragment>
);

const getElementList = memoize(10)((getFn, type, base) => base.concat(Object.values(getFn(type))));

const ActualPreview: FunctionComponent<ActualPreviewProps> = ({
  wrappers,
  viewMode = 'story',
  storyId,
  active,
  scale,
  queryParams,
  customCanvas,
  currentUrl,
  frames,
}: ActualPreviewProps) => {
  const base = customCanvas
    ? customCanvas(viewMode, currentUrl, scale, queryParams, frames, storyId)
    : renderIframe(viewMode, currentUrl, scale, queryParams, frames, storyId);
  return wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, storyId, active }),
    base
  );
};

const IframeWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  background: theme.background.content,
}));

const defaultWrappers: Wrapper[] = [
  {
    render: p => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {p.children}
      </IframeWrapper>
    ),
  },
];

const getTools = memoize(10)(
  (
    getElements: PreviewProps['getElements'],
    queryParams: PreviewProps['queryParams'],
    panels: Panel[],
    api: API,

    docsOnly: boolean,
    options: PreviewProps['options'],
    storyId: PreviewProps['storyId'],
    viewMode: ViewMode,
    location: Location,
    path: string,
    currentUrl: string
  ) => {
    const tools = getElementList(getElements, types.TOOL, [
      panels.filter(p => p.id !== 'canvas').length
        ? {
            render: () => (
              <Fragment>
                <TabBar key="tabs">
                  {panels.map((t, index) => {
                    const to = t.route({ storyId, viewMode, path, location });
                    const isActive = path === to;
                    return (
                      <S.UnstyledLink key={t.id || `l${index}`} to={to}>
                        <TabButton active={isActive}>{t.title}</TabButton>
                      </S.UnstyledLink>
                    );
                  })}
                </TabBar>
                <Separator />
              </Fragment>
            ),
          }
        : null,
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <Fragment>
            <ZoomConsumer>
              {({ set, value }) => (
                <Zoom key="zoom" current={value} set={v => set(value * v)} reset={() => set(1)} />
              )}
            </ZoomConsumer>
            <Separator />
          </Fragment>
        ),
      },
    ]);

    const extraTools = getElementList(getElements, types.TOOLEXTRA, [
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <DesktopOnly>
            <IconButton
              key="full"
              onClick={() => api.toggleFullscreen()}
              title={options.isFullscreen ? 'Exit full screen' : 'Go full screen'}
            >
              <Icons icon={options.isFullscreen ? 'close' : 'expand'} />
            </IconButton>
          </DesktopOnly>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="opener"
            onClick={() =>
              window.open(`${currentUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)
            }
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
          </IconButton>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="copy"
            onClick={() =>
              copy(
                `${window.location.origin}${
                  window.location.pathname
                }${currentUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`
              )
            }
            title="Copy canvas link"
          >
            <Icons icon="copy" />
          </IconButton>
        ),
      },
    ]);

    const filter = item =>
      item &&
      (!item.match ||
        item.match({
          storyId,
          viewMode: docsOnly && viewMode === 'story' ? 'docs' : viewMode,
          location,
          path,
        }));

    const displayItems = list =>
      list.reduce(
        (acc, item, index) =>
          item ? (
            <Fragment key={item.id || item.key || `f-${index}`}>
              {acc}
              {item.render() || item}
            </Fragment>
          ) : (
            acc
          ),
        null
      );

    const left = displayItems(tools.filter(filter));
    const right = displayItems(extraTools.filter(filter));

    return { left, right };
  }
);

const getUrl = story => {
  return (story && story.source) || `iframe.html`;
};

const getDocumentTitle = description => {
  return description ? `${description} ⋅ Storybook` : 'Storybook';
};

class Preview extends Component<PreviewProps> {
  shouldComponentUpdate({
    storyId,
    viewMode,
    options,
    docsOnly,
    queryParams,
    story,
  }: PreviewProps) {
    const { props } = this;
    const newUrl = getUrl(story);
    const oldUrl = getUrl(props.story);

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      storyId !== props.storyId ||
      docsOnly !== props.docsOnly ||
      queryParams !== props.queryParams ||
      newUrl !== oldUrl
    );
  }

  componentDidUpdate(prevProps) {
    const { api, storyId, viewMode, story } = this.props;

    const { viewMode: prevViewMode } = prevProps;

    if (
      story &&
      (story.id !== (prevProps.story ? prevProps.story.id : prevProps.storyId) ||
        (viewMode && viewMode !== prevViewMode))
    ) {
      api.emit(SET_CURRENT_STORY, { storyId: story.knownAs || story.id || storyId, viewMode });
    }
  }

  render() {
    const {
      path,
      location,
      viewMode = 'story',
      storyId,
      queryParams,
      getElements,
      api,

      docsOnly = false,
      customCanvas,
      options,
      description,
      frames = {},
      story,
    } = this.props;
    const currentUrl = getUrl(story);
    const toolbarHeight = options.isToolshown ? 40 : 0;
    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    const panels = getElementList(getElements, types.TAB, [
      {
        route: p => `/story/${p.storyId}`,
        match: p => p.viewMode && p.viewMode.match(/^(story|docs)$/),
        render: p => (
          <ZoomConsumer>
            {({ value }) => {
              const props = {
                viewMode,
                active: p.active,
                wrappers,
                story,
                storyId,
                queryParams,
                scale: value,
                customCanvas,
              };

              return <ActualPreview {...props} frames={frames} currentUrl={currentUrl} />;
            }}
          </ZoomConsumer>
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { left, right } = getTools(
      getElements,
      queryParams,
      panels,
      api,
      docsOnly,
      options,
      storyId,
      viewMode,
      location,
      path,
      currentUrl
    );

    return (
      <ZoomProvider>
        <Fragment>
          {viewMode === 'story' && (
            <Helmet key="description">
              <title>{getDocumentTitle(description)}</title>
            </Helmet>
          )}
          <Toolbar key="toolbar" shown={options.isToolshown} border>
            <Fragment key="left">{left}</Fragment>
            <Fragment key="right">{right}</Fragment>
          </Toolbar>
          <S.FrameWrap key="frame" offset={toolbarHeight}>
            {panels.map(p => (
              <Fragment key={p.id || p.key}>
                {p.render({ active: p.match({ storyId, viewMode, location, path }) })}
              </Fragment>
            ))}
          </S.FrameWrap>
        </Fragment>
      </ZoomProvider>
    );
  }
}

export { Preview };
