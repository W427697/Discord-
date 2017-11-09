import React from 'react';
import glamorous from 'glamorous';
import { css } from 'glamor';

css.global('.ds-dropdown-menu', {
  position: 'relative !important',
  right: '0 !important',
  left: '0 !important',
  boxShadow: '0 0 30px rgba(0,0,0,0.3)',
});

css.global('.ds-dropdown-menu .ds-suggestions', {
  position: 'relative',
  zIndex: 1000,
  marginTop: 8,
});

css.global('.ds-dropdown-menu .ds-suggestion', {
  cursor: 'pointer',
});

css.global(
  '.ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion.suggestion-layout-simple',
  {
    backgroundColor: 'rgba(183, 125, 225, 0.23)',
  }
);

css.global(
  '.ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion:not(.suggestion-layout-simple) .algolia-docsearch-suggestion--content',
  {
    backgroundColor: 'rgba(183, 125, 225, 0.23)',
  }
);

css.global('.ds-dropdown-menu [class^="ds-dataset-"]', {
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.89)',
  borderRadius: '0 0 3px 3px',
  overflow: 'auto',
  padding: '0 8px 8px',
});

css.global('.ds-dropdown-menu *', {
  boxSizing: 'border-box',
});

css.global('.algolia-docsearch-suggestion', {
  position: 'relative',
  padding: '0 8px',
  color: '#02060C',
  overflow: 'hidden',
});

css.global('.algolia-docsearch-suggestion--highlight', {
  color: '#f1618c',
  background: 'rgba(241, 97, 140, 0.11)',
  padding: '0.1em 0.05em',
});

css.global(
  '.algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight',
  {
    color: 'inherit',
    background: 'inherit',
  }
);
css.global(
  '.algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl1 .algolia-docsearch-suggestion--highlight',
  {
    color: 'inherit',
    background: 'inherit',
  }
);

css.global('.algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight', {
  padding: '0 0 1px',
  background: 'inherit',
  boxShadow: 'inset 0 -2px 0 0 rgb(109, 171, 245)',
  color: 'inherit',
});

css.global('.algolia-docsearch-suggestion--content', {
  display: 'block',
  float: 'right',
  width: '70%',
  position: 'relative',
  padding: '5.33333px 0 5.33333px 10.66667px',
  cursor: 'pointer',
});

css.global('.algolia-docsearch-suggestion--content:before', {
  content: '',
  position: 'absolute',
  display: 'block',
  top: 0,
  height: '100%',
  width: 1,
  background: '#ddd',
  left: -1,
});

css.global('.algolia-docsearch-suggestion--category-header', {
  position: 'relative',
  borderBottom: '1px solid #ddd',
  display: 'none',
  marginTop: 8,
  padding: '4px 0',
  fontSize: '1em',
  color: '#33363D',
});

css.global('.algolia-docsearch-suggestion--wrapper', {
  width: '100%',
  float: 'left',
  padding: '8px 0 0 0',
});

css.global('.algolia-docsearch-suggestion--subcategory-column', {
  float: 'left',
  width: '30%',
  display: 'none',
  paddingLeft: 0,
  textAlign: 'right',
  position: 'relative',
  padding: '5.33333px 10.66667px',
  color: '#A4A7AE',
  fontSize: '0.9em',
  wordWrap: 'normal',
});

css.global('.algolia-docsearch-suggestion--subcategory-column:before', {
  content: '',
  position: 'absolute',
  display: 'block',
  top: 0,
  height: '100%',
  width: 1,
  background: '#ddd',
  right: 0,
});

css.global(
  '.algolia-docsearch-suggestion--subcategory-column .algolia-docsearch-suggestion--highlight',
  {
    backgroundColor: 'inherit',
    color: 'inherit',
  }
);

css.global('.algolia-docsearch-suggestion--subcategory-inline', {
  display: 'none',
});

css.global('.algolia-docsearch-suggestion--title', {
  marginBottom: 4,
  color: '#02060C',
  fontSize: '0.9em',
  fontWeight: 'bold',
});

css.global('.algolia-docsearch-suggestion--text', {
  display: 'block',
  lineHeight: '1.2em',
  fontSize: '0.85em',
  color: '#63676D',
});

css.global('.algolia-docsearch-suggestion--no-results', {
  width: '100%',
  padding: '8px 0',
  textAlign: 'center',
  fontSize: '1.2em',
});

css.global('.algolia-docsearch-suggestion--no-results::before', {
  display: 'none',
});

css.global('.algolia-docsearch-suggestion code', {
  padding: '1px 5px',
  fontSize: '90%',
  border: 'none',
  color: '#222222',
  backgroundColor: '#EBEBEB',
  borderRadius: 3,
  fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
});

css.global('.algolia-docsearch-suggestion code .algolia-docsearch-suggestion--highlight', {
  background: 'none',
});

css.global(
  '.algolia-docsearch-suggestion.algolia-docsearch-suggestion__main .algolia-docsearch-suggestion--category-header',
  {
    display: 'none',
  }
);

css.global(
  '.algolia-docsearch-suggestion.algolia-docsearch-suggestion__secondary .algolia-docsearch-suggestion--subcategory-column',
  {
    display: 'block',
  }
);

css.global('.suggestion-layout-simple.algolia-docsearch-suggestion', {
  borderBottom: 'solid 1px #eee',
  padding: 8,
  margin: 0,
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--content', {
  width: '100%',
  padding: 0,
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--content::before', {
  display: 'none',
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--category-header', {
  margin: 0,
  padding: 0,
  display: 'block',
  width: '100%',
  border: 'none',
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl0', {
  opacity: 0.6,
  fontSize: '0.85em',
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl1', {
  opacity: 0.6,
  fontSize: '0.85em',
});

css.global(
  '.suggestion-layout-simple .algolia-docsearch-suggestion--category-header-lvl1::before',
  {
    backgroundImage:
      'url(\'data:image/svg+xml,utf8,<svg width="10" height="10" viewBox="0 0 20 38" xmlns="http://www.w3.org/2000/svg"><path d="M1.49 4.31l14 16.126.002-2.624-14 16.074-1.314 1.51 3.017 2.626 1.313-1.508 14-16.075 1.142-1.313-1.14-1.313-14-16.125L3.2.18.18 2.8l1.31 1.51z" fill-rule="evenodd" fill="%231D3657" /></svg>\')',
    content: '',
    width: 10,
    height: 10,
    display: 'inline-block',
  }
);

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--wrapper', {
  width: '100%',
  float: 'left',
  margin: 0,
  padding: 0,
});

css.global(
  '.suggestion-layout-simple .algolia-docsearch-suggestion--subcategory-column, .suggestion-layout-simple .algolia-docsearch-suggestion--duplicate-content, .suggestion-layout-simple .algolia-docsearch-suggestion--subcategory-inline',
  {
    display: 'none !important',
  }
);

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--title', {
  margin: 0,
  color: '#458EE1',
  fontSize: '0.9em',
  fontWeight: 'normal',
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--title::before', {
  content: '#',
  fontWeight: 'bold',
  color: '#458EE1',
  display: 'inline-block',
});

css.global('.suggestion-layout-simple .algolia-docsearch-suggestion--text', {
  margin: '4px 0 0',
  display: 'block',
  lineHeight: '1.4em',
  padding: '5.33333px 8px',
  background: '#f8f8f8',
  fontSize: '0.85em',
  opacity: 0.8,
});

css.global(
  '.suggestion-layout-simple .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight',
  {
    color: '#3f4145',
    fontWeight: 'bold',
    boxShadow: 'none',
  }
);

css.global('.algolia-docsearch-footer', {
  float: 'right',
  fontSize: 9,
});
css.global('.algolia-docsearch-footer--logo', {
  color: '#6dabf5',
});

const SuggestionsContainer = glamorous.div({
  position: 'fixed',
  left: -24,
  right: -24,
  top: 50,
  zIndex: 1002,
});
const Suggestions = glamorous(props => (
  <SuggestionsContainer>
    <div id="suggestions" {...props} />
  </SuggestionsContainer>
))({
  maxWidth: 800,
  margin: '0 auto',
  position: 'relative',
  paddingBottom: 30,
  paddingLeft: 30,
  paddingRight: 30,
  overflow: 'hidden',
});

export { Suggestions as default };
