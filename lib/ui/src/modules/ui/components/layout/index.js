/* eslint-disable react/no-multi-comp */

import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import PanelGroup from '@storybook/components/dist/layout/split';

const layoutConfigs = {
  regular: {
    direction: 'row',
    items: [
      {
        size: 300,
        resize: 'fixed',
        component: 'addonTabs',
        props: {
          selected: 'action',
        },
      },
      {
        size: 800,
        minSize: 400,
        resize: 'stretch',
        component: 'preview',
        props: {
          primary: true,
        },
      },
      {
        size: 100,
        minSize: 100,
        resize: 'stretch',
        component: 'preview',
      },
      {
        size: 300,
        resize: 'dynamic',
        component: 'explorer',
      },
    ],
  },
  experiment: {
    direction: 'row',
    items: [
      {
        direction: 'column',
        items: [
          {
            size: 300,
            resize: 'dynamic',
            component: 'addonTabs',
          },
          {
            size: 300,
            resize: 'stretch',
            component: 'preview',
          },
        ],
      },
      {
        size: 800,
        minSize: 400,
        resize: 'stretch',
        component: 'preview',
      },
      {
        size: 300,
        resize: 'dynamic',
        component: 'explorer',
      },
    ],
  },
};

const Panel = ({ fullscreen, component: PanelContent, id, name, props: componentProps = {} }) =>
  fullscreen && componentProps.primary !== true && name !== 'preview' ? (
    <div />
  ) : (
    <PanelContent key={id} {...{ fullscreen, ...componentProps }} />
  );

Panel.propTypes = {
  id: PropTypes.node.isRequired,
  component: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  props: PropTypes.shape({
    primary: PropTypes.bool,
  }),
  fullscreen: PropTypes.bool.isRequired,
};
Panel.defaultProps = {
  props: {},
};

const Panels = ({ direction, items, components, fullscreen }) => (
  <PanelGroup
    direction={direction}
    spacing={10}
    borderColor={'transparent'}
    panelWidths={items.map(({ size, resize, minSize }) => ({ size, resize, minSize }))}
  >
    {items.map((item, index) => (
      <PanelItem
        component={components[item.component]}
        name={item.component}
        direction={direction}
        props={item.props}
        key={index}
        id={index}
        fullscreen={fullscreen}
      />
    ))}
  </PanelGroup>
);

Panels.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  components: PropTypes.shape({}).isRequired,
  fullscreen: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(Panel.propTypes),
      PropTypes.shape({
        size: PropTypes.number.isRequired,
        minSize: PropTypes.number,
        resize: PropTypes.oneOf(['dynamic', 'stretch', 'fixed']).isRequired,
        component: PropTypes.string.isRequired,
        props: PropTypes.shape({}),
      }),
    ])
  ).isRequired,
};

/* eslint-disable react/prop-types */
const PanelItem = ({
  component,
  components,
  name,
  direction,
  index,
  items,
  fullscreen,
  props,
  id,
}) =>
  component ? (
    <Panel key={index} {...{ component, name, fullscreen, props, id }} />
  ) : (
    <Panels key={index} {...{ direction, items, fullscreen, components }} />
  );
/* eslint-enable react/prop-types */

const NewLayoutRoot = glamorous.div(
  ({ fullscreen }) =>
    fullscreen
      ? {
          position: 'fixed',
          left: '0px',
          right: '0px',
          top: '0px',
          zIndex: 1,
          backgroundColor: '#FFF',
          height: '100%',
          width: '100%',
          border: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }
      : {
          height: '100vh',
          boxSizing: 'border-box',
          padding: 10,
          backgroundColor: '#F7F7F7',
        }
);

const Preview = glamorous.div(
  ({ primary, fullscreen }) =>
    primary && fullscreen
      ? {
          position: 'fixed',
          left: '0px',
          right: '0px',
          top: '0px',
          zIndex: 10,
          backgroundColor: '#FFF',
          height: '100%',
          width: '100%',
          border: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }
      : {
          width: '100%',
          height: '100%',
          backgroundColor: '#FFF',
          border: '1px solid #ECECEC',
          borderRadius: 4,
          overflow: 'hidden',
        }
);

class NewLayout extends Component {
  constructor(props) {
    super(props);

    this.components = {
      explorer: ({ ...rest }) => props.storiesPanel({ ...rest }),
      preview: ({ fullscreen, primary, ...rest }) => (
        <Preview fullscreen={fullscreen} primary={primary}>
          {props.preview({ ...rest })}
        </Preview>
      ),
      addonTabs: ({ ...rest }) => props.addonPanel({ ...rest }),
    };
  }
  render() {
    const { components, props } = this;
    const { goFullScreen, layout = layoutConfigs.regular } = props;
    const { direction, items } = layout;
    return (
      <NewLayoutRoot fullscreen={goFullScreen}>
        <Panels {...{ direction, items, components, fullscreen: goFullScreen }} />
      </NewLayoutRoot>
    );
  }
}

NewLayout.propTypes = {
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
};

export default NewLayout;

/* WORKLOG - norbert
 *
 * goals:
 * [x] a config that describes the layout 
 * [x] implement config => render 
 * [x] support fullscreen switching
 * 
 * stretch goals
 * [x] allow setting of additional props
 * [ ] get global config from config.js
 * [ ] allow local config from story
 * [ ] allow modifying config at runtime
 * 
 * long stretch goals
 * [ ] persist changes
 * [ ] setting on where to persist (localstorage / config)
 * 
 * ideapad:
 * 
 * 
 * 
*/
