import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderStory = onClick => story => {
  return (
    <div key={story.name}>
      <div onClick={() => onClick(story.name)}>{story.name}</div>
      {story.children &&
        story.children.length > 0 &&
        <ul>
          {story.children.map(renderStory(onClick))}
        </ul>}
    </div>
  );
};

const connectStories = connect(({ stories }) => ({ stories }));
const LeftPanel = connectStories(({ stories, onClick }) =>
  <ul>{stories.map(renderStory(onClick))}</ul>
);

const Layout = connect()(({ preview, dispatch }) =>
  <div>
    <LeftPanel onClick={name => dispatch({ type: '@storybook/ui/SELECT_STORY', name })} />
    {preview}
  </div>
);

Layout.propTypes = {
  preview: PropTypes.element.isRequired,
};

export default Layout;
