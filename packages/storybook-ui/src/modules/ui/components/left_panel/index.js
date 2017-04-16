import React, { PropTypes } from 'react';
import Header from './header';
import Stories from './stories';
import TextFilter from './text_filter';
import pick from 'lodash.pick';
import isString from 'lodash.isstring';
import Media from 'react-media';

import Collapsible from '../collapsible';

const containerStyle = {
  margin: '10px 0px 10px 10px'
};

const scrollStyle = {
  height: 'calc(100vh - 105px)',
  overflow: 'auto',
};

const mobileContainerStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  paddingTop: '10px',
};

const mobileScrollStyle = {
  maxHeight: 'calc(100vw + 100px)',
  overflow: 'auto',
};

/* eslint-disable react/prop-types */
const HeaderAndFilter = (props) => (
  <div>
    <Header
      name={props.name}
      url={props.url}
      openShortcutsHelp={props.openShortcutsHelp}
    />
    <TextFilter
      text={props.storyFilter}
      onClear={() => props.onStoryFilter('')}
      onChange={(text) => props.onStoryFilter(text)}
    />
  </div>
);
/* eslint-enable react/prop-types */

const storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

const LeftPanel = (props) => (
  <Media query="(max-width: 650px)">
    {matches => {
      return matches ? (
        <div style={mobileContainerStyle}>
          <HeaderAndFilter {...props} />
          <Collapsible
            isActive={isString(props.storyFilter)}
            title="component list"
          >
            {props.stories &&
              <div style={mobileScrollStyle}>
                <Stories {...pick(props, storyProps)} />
              </div>
            }
          </Collapsible>
        </div>
      ) : (
        <div style={containerStyle}>
          <HeaderAndFilter {...props} />
          <div style={scrollStyle}>
            { props.stories ? (<Stories {...pick(props, storyProps)} />) : null }
          </div>
        </div>
      );
    }}
  </Media>
);

LeftPanel.propTypes = {
  stories: PropTypes.array,
  selectedKind: PropTypes.string,
  selectedStory: PropTypes.string,
  onSelectStory: PropTypes.func,

  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
};

export default LeftPanel;
