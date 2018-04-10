import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import Stories from '../stories_tree';
import TextFilter from '../Filter';
import { Container } from './Styled';

const storyProps = [
  'selectedKind',
  'selectedHierarchy',
  'selectedStory',
  'onSelectStory',
  'storyFilter',
  'sidebarAnimations',
];

const hierarchyContainsStories = storiesHierarchy =>
  storiesHierarchy && storiesHierarchy.map.size > 0;

class Panel extends Component {
  renderStories() {
    const { storiesHierarchies } = this.props;

    return storiesHierarchies.map(
      hierarchy =>
        hierarchyContainsStories(hierarchy) && (
          <Stories
            key={hierarchy.name}
            {...pick(this.props, storyProps)}
            storiesHierarchy={hierarchy}
          />
        )
    );
  }
  render() {
    const { onStoryFilter, storyFilter } = this.props;
    return (
      <Container>
        <TextFilter
          text={storyFilter}
          onClear={() => onStoryFilter('')}
          onChange={text => onStoryFilter(text)}
        />
        {this.renderStories()}
      </Container>
    );
  }
}

Panel.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
};

Panel.propTypes = {
  storiesHierarchies: PropTypes.arrayOf(
    PropTypes.shape({
      namespaces: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
      map: PropTypes.object,
    })
  ),
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,
};

export default Panel;
