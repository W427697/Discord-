import PropTypes from 'prop-types';
import React from 'react';

const wrapperStyle = theme => ({
  background: theme.palette.background,
  marginBottom: 10,
});

const headingStyle = theme => ({
  fontFamily: theme.baseFont.fontFamily,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '12px', // note: fontSize
  fontWeight: 'bolder',
  color: theme.palette.logoText,
  border: `1px solid ${theme.palette.logoBorder}`,
  textAlign: 'center',
  borderRadius: '2px',
  padding: '5px',
  cursor: 'pointer',
  margin: 0,
  float: 'none',
  overflow: 'hidden',
});

const shortcutIconStyle = theme => ({
  textTransform: 'uppercase',
  letterSpacing: '3.5px',
  fontSize: 12, // note: fontSize
  fontWeight: 'bolder',
  color: theme.palette.logoText,
  border: `1px solid ${theme.palette.logoBorder}`,
  textAlign: 'center',
  borderRadius: 2,
  padding: 5,
  cursor: 'pointer',
  margin: 0,
  display: 'inlineBlock',
  paddingLeft: 8,
  float: 'right',
  marginLeft: 5,
  backgroundColor: 'inherit',
  outline: 0,
});

const linkStyle = {
  textDecoration: 'none',
};

const Header = ({ openShortcutsHelp, name, url, theme }) =>
  <div style={wrapperStyle(theme)}>
    <button style={shortcutIconStyle(theme)} onClick={openShortcutsHelp}>
      ⌘
    </button>
    <a style={linkStyle} href={url} target="_blank" rel="noopener noreferrer">
      <h3 style={headingStyle(theme)}>
        {name}
      </h3>
    </a>
  </div>;

Header.defaultProps = {
  openShortcutsHelp: null,
  name: '',
  url: '',
};

Header.propTypes = {
  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
  theme: PropTypes.shape().isRequired,
};

export default Header;
