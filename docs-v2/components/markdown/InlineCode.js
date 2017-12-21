import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { monoFonts } from '@storybook/components';

const InlineCode = glamorous(({ value, className }) => (
  <code
    className={['prism-code'].concat(className).join(' ')}
    dangerouslySetInnerHTML={{ __html: value }}
  />
))({
  display: 'inline-block',
  whiteSpace: 'pre',
  overflow: 'auto',
  background: 'rgba(255,255,255,0.7)',
  color: '#000',
  padding: '0 5px',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  outline: 'none',
  textShadow: 'none',
  hyphens: 'none',
  wordWrap: 'normal',
  wordBreak: 'normal',
  textAlign: 'left',
  wordSpacing: 'normal',
  tabSize: 2,
  fontSize: '0.8rem',
  fontFamily: monoFonts.fontFamily,
  fontFeatureSettings: '"calt" 1',
  fontWeight: 300,
  borderRadius: 3,
  boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
  marginTop: -2,
  marginBottom: 0,
});
InlineCode.displayName = 'Markdown.InlineCode';
InlineCode.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
};
InlineCode.defaultProps = {
  className: undefined,
};

export { InlineCode as default };
