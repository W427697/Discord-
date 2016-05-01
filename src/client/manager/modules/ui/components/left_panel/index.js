import React from 'react';
import Header from './header';
import Stories from './stories';
import pick from 'lodash.pick';

const mainStyle = {
  padding: 20,
};

const storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

const LeftPanel = (props) => (
  <div style={mainStyle}>
    <Header />
    {props.stories? (<Stories {...pick(props, storyProps)}/>) : null}
  </div>
);

LeftPanel.propTypes = {
  stories: React.PropTypes.array,
  selectedKind: React.PropTypes.string,
  selectedStory: React.PropTypes.string,
  onSelectStory: React.PropTypes.func,
};

export default LeftPanel;
