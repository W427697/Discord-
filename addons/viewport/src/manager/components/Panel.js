import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { baseFonts } from '@storybook/components';
import { document } from 'global';

import {
  initialViewports,
  defaultViewport,
  resetViewport,
  applyDefaultStyles,
} from './viewportInfo';
import { SelectViewport } from './SelectViewport';
import { RotateViewport } from './RotateViewport';
import {
  ADD_VIEWPORTS_EVENT_ID,
  SET_VIEWPORTS_EVENT_ID,
  UPDATE_VIEWPORT_EVENT_ID,
} from '../../shared';

import * as styles from './styles';

const storybookIframe = 'storybook-preview-iframe';
const containerStyles = {
  padding: 15,
  width: '100%',
  boxSizing: 'border-box',
  ...baseFonts,
};

const transformViewports = transformer => viewports =>
  Object.keys(viewports).reduce(
    (all, key) => ({
      ...all,
      [key]: transformer(viewports[key]),
    }),
    {}
  );

const viewportsTransformer = transformViewports(applyDefaultStyles);

export class Panel extends Component {
  static propTypes = {
    channel: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      viewport: defaultViewport,
      viewports: initialViewports,
      isLandscape: false,
    };
  }

  componentDidMount() {
    this.iframe = document.getElementById(storybookIframe);

    this.props.channel.on(UPDATE_VIEWPORT_EVENT_ID, this.changeViewport);
    this.props.channel.on(ADD_VIEWPORTS_EVENT_ID, this.addViewports);
    this.props.channel.on(SET_VIEWPORTS_EVENT_ID, this.setViewports);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(UPDATE_VIEWPORT_EVENT_ID, this.changeViewport);
    this.props.channel.removeListener(ADD_VIEWPORTS_EVENT_ID, this.addViewports);
    this.props.channel.removeListener(SET_VIEWPORTS_EVENT_ID, this.setViewports);
  }

  setViewports = viewports => {
    const newViewports = viewportsTransformer(viewports);

    this.setState({ viewports: newViewports });
  };

  addViewports = viewports => {
    const newViewports = viewportsTransformer(viewports);

    this.setState({
      viewports: {
        ...initialViewports,
        ...newViewports,
      },
    });
  };

  iframe = undefined;

  changeViewport = viewport => {
    const { viewport: previousViewport } = this.state;

    if (previousViewport !== viewport) {
      this.setState(
        {
          viewport,
          isLandscape: false,
        },
        this.updateIframe
      );
    }
  };

  toggleLandscape = () => {
    const { isLandscape } = this.state;

    this.setState({ isLandscape: !isLandscape }, this.updateIframe);
  };

  updateIframe = () => {
    const { viewports, viewport: viewportKey, isLandscape } = this.state;
    const viewport = viewports[viewportKey] || resetViewport;

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    Object.keys(viewport.styles).forEach(prop => {
      this.iframe.style[prop] = viewport.styles[prop];
    });

    if (isLandscape) {
      this.iframe.style.height = viewport.styles.width;
      this.iframe.style.width = viewport.styles.height;
    }
  };

  render() {
    const { isLandscape, viewport, viewports } = this.state;

    const disableDefault = viewport === defaultViewport;
    const disabledStyles = disableDefault ? styles.disabled : {};

    const buttonStyles = {
      ...styles.button,
      ...disabledStyles,
      marginTop: 30,
      padding: 20,
    };

    return (
      <div style={containerStyles}>
        <SelectViewport
          viewports={viewports}
          defaultViewport={defaultViewport}
          activeViewport={viewport}
          onChange={e => this.changeViewport(e.target.value)}
        />

        <RotateViewport
          onClick={this.toggleLandscape}
          disabled={disableDefault}
          active={isLandscape}
        />

        <button
          style={buttonStyles}
          onClick={() => this.changeViewport(defaultViewport)}
          disabled={disableDefault}
        >
          Reset Viewport
        </button>
      </div>
    );
  }
}
