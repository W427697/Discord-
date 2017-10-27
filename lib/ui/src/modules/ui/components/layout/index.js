/* eslint-disable react/no-multi-comp */

import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import PanelGroup from '@storybook/components/dist/layout/split';

const Panel = ({ fullscreen, component: PanelContent, id, name, props: componentProps = {} }) =>
  fullscreen && componentProps.primary !== true && name !== 'preview' ? (
    <div />
  ) : (
    <PanelContent
      {...{
        fullscreen,
        ...componentProps,
      }}
    />
  );

Panel.propTypes = {
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

const Panels = ({ direction, items, components, fullscreen, showAddons, showExplorer }) => {
  const list = items
    .map((item, index) => ({ ...item, id: index }))
    .filter(({ props, component }) => {
      const { shouldShow = () => true } = components[component];
      // debugger; //eslint-disable-line
      return shouldShow({ ...props, fullscreen, showAddons, showExplorer });
    });

  return (
    <PanelGroup
      direction={direction}
      spacing={10}
      borderColor={'transparent'}
      panelWidths={list.map(({ size, resize, minSize }) => ({ size, resize, minSize }))}
    >
      {list.map(({ props, component, id }) => (
        <PanelItem
          component={components[component]}
          name={component}
          direction={direction}
          props={props}
          key={id}
          id={id}
          fullscreen={fullscreen}
        />
      ))}
    </PanelGroup>
  );
};

Panels.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  components: PropTypes.shape({}).isRequired,
  fullscreen: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(Panel.propTypes),
      PropTypes.shape({
        id: PropTypes.string,
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
  shouldShow,
  props,
  style,
  id,
}) =>
  component ? (
    <Panel key={index} {...{ component, name, fullscreen, props, id, shouldShow, style }} />
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
      explorer: props.storiesPanel,
      preview: ({ fullscreen, primary, ...rest }) => (
        <Preview fullscreen={fullscreen} primary={primary}>
          {props.preview({ ...rest })}
        </Preview>
      ),
      addonTabs: props.addonPanel,
    };
  }
  render() {
    const { components, props } = this;
    const {
      goFullScreen,
      showStoriesPanel,
      showAddonPanel,
      layout = layoutConfigs.regular,
    } = props;
    const { direction, items } = layout;
    return (
      <NewLayoutRoot
        {...{
          fullscreen: goFullScreen,
          showExplorer: showStoriesPanel,
          showAddons: showAddonPanel,
        }}
      >
        <Panels
          {...{
            direction,
            items,
            components,
            fullscreen: goFullScreen,
            showExplorer: showStoriesPanel,
            showAddons: showAddonPanel,
          }}
        />
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
 * [x] get global config from config.js
 * [-] allow local config from story
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
