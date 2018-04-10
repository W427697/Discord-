import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Panel from './Panel';

class StoriesPanel extends Component {
  state = {};
  render() {
    const { name, openShortcutsHelp, url, shortcutOptions } = this.props;

    return (
      <Fragment>
        <Header
          name={typeof name === 'object' ? name : undefined}
          url={url}
          openShortcutsHelp={shortcutOptions.enableShortcuts ? openShortcutsHelp : null}
          enableShortcutsHelp={shortcutOptions.enableShortcuts}
        />
        <Panel {...this.props} />
      </Fragment>
    );
  }
}

StoriesPanel.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
  name: {
    short: '',
    full: '',
  },
  url: '',
  shortcutOptions: {
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: false,
    enableShortcuts: true,
  },
};

StoriesPanel.propTypes = {
  storiesHierarchies: PropTypes.arrayOf(
    PropTypes.shape({
      namespaces: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
      map: PropTypes.object,
    })
  ),
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
  // eslint-disable-next-line
  name: PropTypes.any,
  url: PropTypes.string,
  shortcutOptions: PropTypes.shape({
    goFullScreen: PropTypes.bool,
    showStoriesPanel: PropTypes.bool,
    showAddonPanel: PropTypes.bool,
    showSearchBox: PropTypes.bool,
    addonPanelInRight: PropTypes.bool,
    enableShortcuts: PropTypes.bool,
  }),
};

export default StoriesPanel;
