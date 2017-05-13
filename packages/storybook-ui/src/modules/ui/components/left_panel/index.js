import PropTypes from 'prop-types';
import React from 'react';
import Header from './header';
import Menu from './menu';
import Stories from './stories';
import TextFilter from './text_filter';
import pick from 'lodash.pick';

const scrollStyle = {
  flexGrow: 1,
  marginTop: 10,
  marginLeft: 10,
  overflowY: 'auto',
};

const mainStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
};

const storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

const LeftPanel = props => (
  <div style={mainStyle}>
    <div style={{ padding: 10, paddingRight: 0 }}>
      <Header name={props.name} url={props.url} openShortcutsHelp={props.openShortcutsHelp} />
      <TextFilter
        text={props.storyFilter}
        onClear={() => props.onStoryFilter('')}
        onChange={text => props.onStoryFilter(text)}
      />
      <Menu />
    </div>
    <div style={scrollStyle}>
      {props.stories ? <Stories {...pick(props, storyProps)} /> : null}
    </div>
  </div>
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
