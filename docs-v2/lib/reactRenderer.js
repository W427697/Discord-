import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Prism from 'prismjs';
import { css } from 'glamor';

import unified from 'unified';
import u from 'unist-builder';
import remarkParse from 'remark-parse';
import reactRenderer from 'remark-react';

import myCustomBlocks from './myCustomBlocks';
import myCustomToc from './myCustomToc';

css.global('.prism-code', {
  display: 'block',
  color: '#C5C8C6',
  padding: '0.5rem',
  boxSizing: 'border-box',
  verticalAlign: 'baseline',
  outline: 'none',
  textShadow: 'none',
  hyphens: 'none',
  wordWrap: 'normal',
  wordBreak: 'normal',
  textAlign: 'left',
  wordSpacing: 'normal',
  tabSize: '2',
  background: 'rgba(0, 0, 0, 0.7)',
  fontSize: '0.8rem',
  fontFamily: '"Operator Mono SSm A", "Operator Mono SSm B", monospace',
  fontWeight: 300,
  whiteSpace: 'pre-wrap',
  borderRadius: '3px',
  boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
  overflowX: 'hidden',
});

css.global('.token.comment, .token.prolog, .token.doctype, .token.cdata', {
  color: '#5C6370',
});

css.global('.token.punctuation', {
  color: '#abb2bf',
});

css.global('.token.selector, .token.tag', {
  color: '#e06c75',
});

css.global(
  '.token.property, .token.boolean, .token.number, .token.constant, .token.symbol, .token.attr-name, .token.deleted',
  {
    color: '#d19a66',
  }
);

css.global('.token.string, .token.char, .token.attr-value, .token.builtin, .token.inserted', {
  color: '#98c379',
});

css.global(
  '.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string',
  {
    color: '#56b6c2',
  }
);

css.global('.token.atrule, .token.keyword', {
  color: '#c678dd',
});

css.global('.token.function', {
  color: '#61afef',
});

css.global('.token.regex, .token.important, .token.variable', {
  color: '#c678dd',
});

css.global('.token.important, .token.bold', {
  fontWeight: 'bold',
});

css.global('.token.italic', {
  fontStyle: 'italic',
});

css.global('.token.entity', {
  cursor: 'help',
});

const splitLang = /([\w#+]+)(?:\s\/\/\s(.+\.\w+)?(?:\s\|\s)?(\w+)?)?/;
const code = (h, node) => {
  const { value } = node;
  const [, lang, filename, framework] = node.lang.match(splitLang);
  const props = { lang, filename, framework };
  return h(node, 'code', props, [u('text', value)]);
};
const Code = glamorous(({ children, className, lang, ...rest }) => {
  // console.log('code', { children, className, lang, ...rest });
  const html = Prism.highlight(children[0], Prism.languages.javascript);
  return (
    <span {...{ className }}>
      {Object.keys(rest).length
        ? <pre>
            {JSON.stringify(rest, null, 2)}
          </pre>
        : null}
      <code className="prism-code" dangerouslySetInnerHTML={{ __html: html }} />
    </span>
  );
})({
  whiteSpace: 'pre',
  'p > &': {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
  },
  'div > &': {
    display: 'block',
    marginBottom: 20,
  },
});
Code.displayName = 'Code';
Code.propTypes = {
  children: PropTypes.node.isRequired,
};

const Component = glamorous(({ children, className, component, ...rest }) => {
  console.log('component', { children, className, ...rest });
  return (
    <div {...{ className }}>
      {children}
    </div>
  );
})({
  background: 'deeppink',
});
Component.displayName = 'MarkdownReactComponent';
Component.propTypes = {
  children: PropTypes.node.isRequired,
};

export const parser = markdown =>
  unified()
    .use(remarkParse)
    .use(myCustomBlocks)
    .use(myCustomToc)
    .use(reactRenderer, {
      sanitize: false,
      remarkReactComponents: {
        code: Code,
        component: Component,
      },
      toHast: {
        handlers: {
          code,
        },
      },
    })
    .processSync(markdown).contents.props.children;
