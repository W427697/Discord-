import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useStorybookApi } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Link, isIdLike } from '@storybook/router';
import { SyntaxHighlighter } from '@storybook/components';

import createElement from 'react-syntax-highlighter/dist/esm/create-element';
import { EVENT_ID } from './events';

const StyledStoryLink = styled(Link)(({ theme }) => ({
  display: 'block',
  textDecoration: 'none',
  borderRadius: theme.appBorderRadius,
  color: 'inherit',

  '&:hover': {
    background: theme.background.hoverable,
  },
}));

const SelectedStoryHighlight = styled.div(({ theme }) => ({
  background: theme.background.hoverable,
  borderRadius: theme.appBorderRadius,
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

const areLocationsEqual = (a, b) =>
  a.startLoc.line === b.startLoc.line &&
  a.startLoc.col === b.startLoc.col &&
  a.endLoc.line === b.endLoc.line &&
  a.endLoc.col === b.endLoc.col;

const getLocationKeys = locationsMap =>
  locationsMap
    ? Array.from(Object.keys(locationsMap)).sort(
        (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
      )
    : [];

const createPart = (rows, stylesheet, useInlineStyles) =>
  rows.map((node, i) =>
    createElement({
      node,
      stylesheet,
      useInlineStyles,
      key: `code-segement${i}`,
    })
  );

const StoryPart = ({
  rows,
  stylesheet,
  useInlineStyles,
  location,
  id,
  currentLocation,
  selectedStoryRef,
}) => {
  const api = useStorybookApi();
  const storyId = isIdLike(id) ? id : api.getIdByExportNameInCurrentKind(id);
  const first = location.startLoc.line - 1;
  const last = location.endLoc.line;

  const storyRows = rows.slice(first, last);
  const story = createPart(storyRows, stylesheet, useInlineStyles);
  const storyKey = `${first}-${last}`;

  if (location && currentLocation && areLocationsEqual(location, currentLocation)) {
    return (
      <SelectedStoryHighlight key={storyKey} ref={selectedStoryRef}>
        {story}
      </SelectedStoryHighlight>
    );
  }

  return (
    <StyledStoryLink to={`/story/${storyId}`} key={storyKey}>
      {story}
    </StyledStoryLink>
  );
};

const locPropType = PropTypes.shape({ col: PropTypes.number, line: PropTypes.number }).isRequired;
const locationPropType = PropTypes.shape({
  startLoc: locPropType,
  endLoc: locPropType,
  startBody: locPropType,
  endBody: locPropType,
});
StoryPart.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  stylesheet: PropTypes.objectOf(PropTypes.string).isRequired,
  useInlineStyles: PropTypes.bool.isRequired,
  location: locationPropType,
  id: PropTypes.string.isRequired,
  currentLocation: locationPropType,
  selectedStoryRef: PropTypes.func.isRequired,
};
StoryPart.defaultProps = {
  location: null,
  currentLocation: null,
};

export default class StoryPanel extends Component {
  state = { source: 'loading source...' };

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.listener);
  }

  componentDidUpdate() {
    if (this.selectedStoryRef) {
      this.selectedStoryRef.scrollIntoView();
    }
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(EVENT_ID, this.listener);
  }

  setSelectedStoryRef = ref => {
    this.selectedStoryRef = ref;
  };

  listener = ({ edition: { source }, location: { currentLocation, locationsMap } }) => {
    const locationsKeys = getLocationKeys(locationsMap);
    this.setState({
      source,
      currentLocation,
      locationsMap,
      locationsKeys,
    });
  };

  createParts = (rows, stylesheet, useInlineStyles) => {
    const { locationsMap, locationsKeys, currentLocation } = this.state;

    const parts = [];
    let lastRow = 0;

    locationsKeys.forEach(key => {
      const location = locationsMap[key];
      const first = location.startLoc.line - 1;
      const last = location.endLoc.line;

      const start = createPart(rows.slice(lastRow, first), stylesheet, useInlineStyles);
      const storyPart = (
        <StoryPart
          rows={rows}
          stylesheet={stylesheet}
          useInlineStyles={useInlineStyles}
          location={location}
          id={key}
          key={key}
          currentLocation={currentLocation}
          selectedStoryRef={this.setSelectedStoryRef}
        />
      );

      parts.push(start);
      parts.push(storyPart);

      lastRow = last;
    });

    const lastPart = createPart(rows.slice(lastRow), stylesheet, useInlineStyles);

    parts.push(lastPart);

    return parts;
  };

  lineRenderer = ({ rows, stylesheet, useInlineStyles }) => {
    const { locationsMap, locationsKeys } = this.state;

    // because of the usage of lineRenderer, all lines will be wrapped in a span
    // these spans will receive all classes on them for some reason
    // which makes colours casecade incorrectly
    // this removed that list of classnames
    const myrows = rows.map(({ properties, ...rest }) => ({
      ...rest,
      properties: { className: [] },
    }));

    if (!locationsMap || !locationsKeys.length) {
      return createPart(myrows, stylesheet, useInlineStyles);
    }

    const parts = this.createParts(myrows, stylesheet, useInlineStyles);

    return <span>{parts}</span>;
  };

  render() {
    const { active } = this.props;
    const { source } = this.state;

    return active ? (
      <StyledSyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        renderer={this.lineRenderer}
        format={false}
        copyable={false}
        padded
      >
        {source}
      </StyledSyntaxHighlighter>
    ) : null;
  }
}

StoryPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
    emit: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }).isRequired,
};
