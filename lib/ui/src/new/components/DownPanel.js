import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { baseFonts } from './theme';

const style = {
  empty: {
    flex: 1,
    display: 'flex',
    ...baseFonts,
    fontSize: 11,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: 4,
    border: 'solid 1px rgb(236, 236, 236)',
    marginTop: 5,
    width: '100%',
  },

  tabbar: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottom: 'solid 1px #eaeaea',
  },

  content: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    overflow: 'auto',
  },

  tablink: {
    ...baseFonts,
    fontSize: 11,
    letterSpacing: '1px',
    padding: '10px 15px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    transition: 'opacity 0.3s',
    opacity: 0.5,
    maxHeight: 60,
    overflow: 'hidden',
    cursor: 'pointer',
  },

  activetab: {
    opacity: 1,
  },
};

class DownPanel extends Component {
  renderTab(name, panel) {
    let tabStyle = style.tablink;
    if (this.props.selectedPanel === name) {
      tabStyle = Object.assign({}, style.tablink, style.activetab);
    }

    const onClick = () => e => {
      e.preventDefault();
      this.props.onPanelSelect(name);
    };

    let title = panel.title;
    if (typeof title === 'function') {
      title = title();
    }

    return (
      <a key={name} style={tabStyle} onClick={onClick()} role="tab" tabIndex="0">
        {title}
      </a>
    );
  }

  renderTabs() {
    return Object.keys(this.props.panels).map(name => {
      const panel = this.props.panels[name];
      return this.renderTab(name, panel);
    });
  }

  renderPanels() {
    return Object.keys(this.props.panels).sort().map(name => {
      const panelStyle = { display: 'none' };
      const panel = this.props.panels[name];
      if (name === this.props.selectedPanel) {
        Object.assign(panelStyle, { flex: 1, display: 'flex' });
      }
      return <div key={name} style={panelStyle} role="tabpanel">{panel.render()}</div>;
    });
  }

  renderEmpty() {
    return (
      <div style={style.empty}>
        no panels available
      </div>
    );
  }

  render() {
    if (!this.props.panels || !Object.keys(this.props.panels).length) {
      return this.renderEmpty();
    }
    return (
      <div style={style.wrapper}>
        <div style={style.tabbar} role="tablist">{this.renderTabs()}</div>
        <div style={style.content}>{this.renderPanels()}</div>
      </div>
    );
  }
}

DownPanel.defaultProps = {
  panels: {},
  onPanelSelect: () => {},
  selectedPanel: null,
};

DownPanel.propTypes = {
  panels: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onPanelSelect: PropTypes.func,
  selectedPanel: PropTypes.string,
};

export default DownPanel;
