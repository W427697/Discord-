/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react';
import PropTypes from 'prop-types';

const themeInfo = {
  palette: {
    textColor: 'hsl(218, 54%, 20%)',
    linkColor: 'hsl(216, 100%, 40%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
  },
  code: {
    textColor: 'hsl(218, 54%, 20%)',
    backgroundColor: 'hsl(0, 0%, 96%)',
    borderColor: 'hsl(0, 0%, 80%)',
    borderRadius: 3,
  },
  baseFonts:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
};
const codeStyle = theme => ({
  border: `1px ${theme.code.borderColor} solid`,
  borderRadius: theme.code.borderRadius,
  color: theme.code.textColor,
  backgroundColor: theme.code.backgroundColor,
  padding: '1px 3px',
});
const mainStyle = (theme, overrides) => ({
  fontFamily: theme.baseFonts,
  fontSize: 14,
  color: theme.palette.textColor,
  backgroundColor: theme.palette.backgroundColor,
  ...overrides,
});
const linkStyle = theme => ({
  color: theme.palette.linkColor,
  textDecoration: 'none',
});

export const CodeFenced = props => <code {...props} />;
export const CodeInline = props => <code {...props} style={codeStyle(themeInfo)} />;

export const Pre = props => {
  const isFenced = props.children[0] ? props.children[0].type.name === 'code' : false;
  if (isFenced)
    return (
      <pre className="fenced-code" style={codeStyle(themeInfo)}>
        <CodeFenced {...props.children[0].props} />
      </pre>
    );
  return <pre {...props} />;
};

Pre.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

const components = {
  h1: props => <h1 {...props} style={mainStyle(themeInfo, { fontSize: 24, fontWeight: 500 })} />,
  h2: props => <h2 {...props} style={mainStyle(themeInfo, { fontSize: 20, fontWeight: 500 })} />,
  h3: props => <h3 {...props} style={mainStyle(themeInfo, { fontSize: 16, fontWeight: 600 })} />,
  h4: props =>
    <h4
      {...props}
      style={mainStyle(themeInfo, { fontSize: 12, fontWeight: 600, textTransform: 'uppercase' })}
    />,
  h5: props =>
    <h4
      {...props}
      style={mainStyle(themeInfo, {
        fontSize: 12,
        fontWeight: 600,
        color: '#5e6c84',
        textTransform: 'uppercase',
      })}
    />,
  h6: props =>
    <h4
      {...props}
      style={mainStyle(themeInfo, {
        fontSize: 10,
        fontWeight: 600,
        color: '#5e6c84',
        textTransform: 'uppercase',
      })}
    />,
  p: props => <p {...props} style={mainStyle(themeInfo)} />,
  a: props => <a {...props} style={linkStyle(themeInfo)} />,
  ul: props => <ul {...props} style={mainStyle(themeInfo)} />,
  ol: props => <ol {...props} style={mainStyle(themeInfo)} />,
  li: props => <li {...props} style={mainStyle(themeInfo, { margin: '8px 0px' })} />,
  table: props => <table {...props} style={mainStyle(themeInfo)} />,
  strong: props => <strong {...props} style={{ color: 'hsl(258, 64%, 18%)' }} />,
  code: props => <CodeInline {...props} />,
  pre: Pre,
};

export const options = {
  repository: 'https://github.com/storybooks/storybook',
  components,
  createElement: React.createElement,
};
