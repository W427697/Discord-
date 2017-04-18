import React, { PropTypes } from 'react';
import pick from 'lodash.pick';
import isString from 'lodash.isstring';
import Media from 'react-media';
import Header from './header';
import Stories from './stories';
import TextFilter from './text_filter';
import Collapsible from '../collapsible';

const containerStyle = {
  margin: '10px 0px 10px 10px',
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

const storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

const LeftPanel = (props) => (
  <Media query="(max-width: 650px)">
    {matches => (
      matches ? (
        <div style={mobileContainerStyle}>
          <Header
            name={props.name}
            url={props.url}
            openShortcutsHelp={props.openShortcutsHelp}
          />
          <Collapsible
            isActive={isString(props.storyFilter)}
            title="component list"
          >
            <TextFilter
              text={props.storyFilter}
              onClear={() => props.onStoryFilter('')}
              onChange={(text) => props.onStoryFilter(text)}
            />
            {props.stories &&
              <div style={mobileScrollStyle}>
                <Stories {...pick(props, storyProps)} />
              </div>
            }
          </Collapsible>
        </div>
      ) : (
        <div style={containerStyle}>
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
          <div style={scrollStyle}>
            { props.stories ? (<Stories {...pick(props, storyProps)} />) : null }
          </div>
        </div>
      )
    )}
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
