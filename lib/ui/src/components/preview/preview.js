import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';
import { Helmet } from 'react-helmet-async';
import { Toolbar } from './toolbar';
import * as S from './components';
import { ZoomProvider, ZoomConsumer } from './zoom';
import { Grid, Background, BackgroundProvider, BackgroundConsumer } from './background';
import { IFrame } from './iframe';

import { stringifyQueryParams } from './libs/stringifyQueryParams';
import { getTools, getElementList } from './libs/getTools';

const renderIframe = (storyId, viewMode, id, baseUrl, scale, queryParams) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`${baseUrl}?id=${storyId}&viewMode=${viewMode}${stringifyQueryParams(queryParams)}`}
    allowFullScreen
    scale={scale}
  />
);

const ActualPreview = ({
  wrappers,
  viewMode,
  id,
  storyId,
  active,
  baseUrl,
  scale,
  queryParams,
  customCanvas,
}) => {
  const data = [storyId, viewMode, id, baseUrl, scale, queryParams];
  const base = customCanvas ? customCanvas(...data) : renderIframe(...data);

  return wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
    base
  );
};

const defaultWrappers = [
  { render: p => <div hidden={!p.active}>{p.children}</div> },
  {
    render: p => (
      <BackgroundConsumer>
        {({ value, grid }) => (
          <Background id="storybook-preview-background" value={value}>
            {grid ? <Grid /> : null}
            {p.children}
          </Background>
        )}
      </BackgroundConsumer>
    ),
  },
];

class Preview extends Component {
  shouldComponentUpdate({ storyId, viewMode, options, queryParams }) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      storyId !== props.storyId ||
      queryParams !== props.queryParams
    );
  }

  componentDidUpdate(prevProps) {
    const { api, storyId, viewMode } = this.props;
    const { storyId: prevStoryId, viewMode: prevViewMode } = prevProps;
    if ((storyId && storyId !== prevStoryId) || (viewMode && viewMode !== prevViewMode)) {
      api.emit(SET_CURRENT_STORY, { storyId, viewMode });
    }
  }

  render() {
    const {
      id,
      path,
      location,
      viewMode,
      storyId,
      queryParams,
      getElements,
      api,
      customCanvas,
      options,
      description,
      baseUrl,
    } = this.props;

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
                id,
                storyId,
                baseUrl,
                queryParams,
                scale: value,
                customCanvas,
              };

              return <ActualPreview {...props} />;
            }}
          </ZoomConsumer>
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { left, right } = getTools({ ...this.props, panels });

    return (
      <BackgroundProvider>
        <ZoomProvider>
          <Fragment>
            {id === 'main' && (
              <Helmet key="description">
                <title>{description ? `${description} ⋅ ` : ''}Storybook</title>
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
      </BackgroundProvider>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  customCanvas: PropTypes.func,
  api: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
    toggleFullscreen: PropTypes.func,
  }).isRequired,
  storyId: PropTypes.string,
  path: PropTypes.string,
  viewMode: PropTypes.oneOf(['story', 'info', 'docs', 'settings']),
  location: PropTypes.shape({}).isRequired,
  getElements: PropTypes.func.isRequired,
  queryParams: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
    isToolshown: PropTypes.bool,
  }).isRequired,
  baseUrl: PropTypes.string,
};

Preview.defaultProps = {
  viewMode: undefined,
  storyId: undefined,
  path: undefined,
  description: undefined,
  baseUrl: 'iframe.html',
  customCanvas: undefined,
};

export { Preview };
