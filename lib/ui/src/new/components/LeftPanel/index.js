import PropTypes from 'prop-types';
import React from 'react';
import glamorous from 'glamorous';
import Header from './Header';
import Stories from '../../containers/Stories';
import TextFilter from './TextFilter';

const StoriesWrapper = glamorous.div({
  height: 'calc(100vh - 105px)',
  marginTop: 10,
  overflowY: 'auto',
});

const mainStyle = {
  padding: '10px 0 10px 10px',
};

const LeftPanel = props =>
  <div style={mainStyle}>
    <Header name={props.name} url={props.url} openShortcutsHelp={props.openShortcutsHelp} />
    <TextFilter
      text={props.storyFilter}
      onClear={() => props.onStoryFilter('')}
      onChange={text => props.onStoryFilter(text)}
    />
    <StoriesWrapper>
      <Stories />
    </StoriesWrapper>
  </div>;

LeftPanel.defaultProps = {
  stories: null,
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
  name: '',
  url: '',
};

LeftPanel.propTypes = {
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
};

export default LeftPanel;
