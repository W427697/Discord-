import React from 'react';
import PropTypes from 'prop-types';

import unified from 'unified';
import remarkParser from 'remark-parse';
import github from 'remark-github';
import remarkRehype from 'remark-rehype';
import highlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';

const baseFonts =
  '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif';

const propTypes = {
  props: PropTypes.object,
  children: PropTypes.array,
};

const defaultProps = {
  props: {},
  children: [],
};

const components = {
  p: ({ props, children }) =>
    <p
      {...props}
      style={{
        fontFamily: baseFonts,
        fontSize: 14,
      }}
    >
      {children}
    </p>,
  a_of: ({ props, children }) =>
    <a
      {...props}
      style={{
        cursor: 'pointer',
        color: '#0366d6',
      }}
    >
      [props: {props} ]
      {children}
    </a>,
  ul: ({ props, children }) =>
    <ul
      {...props}
      style={{
        fontFamily: baseFonts,
        fontSize: 13,
        opacity: 0.7,
      }}
    >
      {children}
    </ul>,
  ol: ({ props, children }) =>
    <ol
      {...props}
      style={{
        fontFamily: baseFonts,
        fontSize: 13,
        opacity: 0.7,
      }}
    >
      {children}
    </ol>,
  strong: ({ props, children }) =>
    <strong
      {...props}
      style={{
        color: 'hsl(0, 0%, 5%)',
        fontFamily: baseFonts,
        fontSize: 16,
      }}
    >
      {children}
    </strong>,
  code: ({ props, children }) =>
    <code
      {...props}
      style={
        children.length > 1
          ? {
              fontSize: 14,
            }
          : {
              border: '1px solid hsl(0, 0%, 80%)',
              borderRadius: 4,
              // color: '#0366d6',
              backgroundColor: 'hsl(0, 0%, 90%)',
              padding: '2px 4px',
              margin: '2px 6px',
            }
      }
    >
      {children}
    </code>,
  pre: ({ props, children }) =>
    <pre
      {...props}
      style={{
        border: '1px solid hsl(0, 0%, 80%)',
        borderRadius: 4,
        padding: 6,
      }}
    >
      {children}
    </pre>,
};

components.p.propTypes = propTypes;
components.a_of.propTypes = propTypes;
components.ul.propTypes = propTypes;
components.ol.propTypes = propTypes;
components.strong.propTypes = propTypes;
components.code.propTypes = propTypes;
components.pre.propTypes = propTypes;

components.p.defaultProps = defaultProps;
components.a_of.defaultProps = defaultProps;
components.ul.defaultProps = defaultProps;
components.ol.defaultProps = defaultProps;
components.strong.defaultProps = defaultProps;
components.code.defaultProps = defaultProps;
components.pre.defaultProps = defaultProps;

let options = {
  repository: 'https://github.com/storybooks/storybook',
  components,
  createElement: React.createElement,
};

function setupProcessor() {
  return unified()
    .use(remarkParser)
    .use(github, {
      repository: options.repository,
    })
    .use(remarkRehype)
    .use(highlight)
    .use(rehypeReact, {
      createElement: options.createElement,
      components: options.components,
    });
}

let processor = setupProcessor();

export function setOptions(newOptions) {
  options = {
    ...options,
    ...newOptions,
  };
  processor = setupProcessor();
}

export default function compile(markdown) {
  return processor.processSync(markdown).contents;
}
