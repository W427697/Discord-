/* eslint-disable consistent-return, no-cond-assign, no-param-reassign */

const fs = require('fs');
const p = require('path');
const serialize = require('babel-literal-to-ast');
const slugify = require('github-slugger')();

const unified = require('unified');
const remarkParse = require('remark-parse');
const myCustomBlocks = require('./myCustomBlocks');
const mySyntaxHighlighting = require('./syntaxHighlighting');

const parser = markdown => unified().use(remarkParse).use(myCustomBlocks).parse(markdown);

module.exports = function({ types: t }) {
  slugify.reset();

  const mapProps = props =>
    props
      ? Object.keys(props).map(key => {
          const value = props[key];
          const isString = typeof value === 'string';
          return t.jSXAttribute(
            t.JSXIdentifier(key),
            isString ? t.StringLiteral(value) : t.JSXExpressionContainer(serialize(value))
          );
        })
      : [];

  const S = children => {
    switch (true) {
      case typeof children === 'string': {
        return children;
      }
      case Array.isArray(children): {
        return children.reduce((acc, item) => acc + S(item), '');
      }
      case Array.isArray(children.children): {
        return children.children.reduce((acc, item) => acc + S(item), '');
      }
      case children.type === 'text': {
        return S(children.value);
      }
      default: {
        return '';
      }
    }
  };

  const R = (name, props, children) =>
    t.jSXElement(
      t.jSXOpeningElement(t.jSXIdentifier(name), mapProps(props), false),
      t.jSXClosingElement(t.jSXIdentifier(name)),
      children || [],
      children && children.length === 0
    );
  const NR = (obj, name, props, children) =>
    t.jSXElement(
      t.jSXOpeningElement(
        t.JSXMemberExpression(t.jSXIdentifier(obj), t.jSXIdentifier(name)),
        mapProps(props),
        false
      ),
      t.jSXClosingElement(t.JSXMemberExpression(t.jSXIdentifier(obj), t.jSXIdentifier(name))),
      children || [],
      children && children.length === 0
    );

  const mapChildren = (children, context = { definitions: {} }) =>
    children
      .reduce((acc, item) => {
        if (!item) {
          return acc;
        }
        // remove definitions from flow and add to context
        if (item.type === 'definition') {
          // eslint-disable-next-line no-param-reassign
          context.definitions[item.identifier] = item;
          return acc;
        }
        // continue flow & map to type
        return acc.concat({
          // eslint-disable-next-line no-use-before-define
          fn: elementMap[item.type] || elementMap.text,
          item,
        });
      }, [])
      .map(({ fn, item }) => fn(item, context));

  const splitLang = /([\w#+]+)(?:\s\/\/\s(.+\.\w+)?(?:\s\|\s)?(\w+)?)?/;
  const elementMap = {
    heading: ({ depth, children }, context) =>
      R(
        `h${depth}`,
        { id: slugify.slug(S(children)), 'aria-level': depth, title: S(children) },
        mapChildren(children, context)
      ),
    paragraph: ({ children }, context) => R('p', null, mapChildren(children, context)),
    list: ({ children, ordered }, context) =>
      R(ordered ? 'ol' : 'ul', null, mapChildren(children, context)),
    listItem: ({ children }, context) => R('li', null, mapChildren(children, context)),
    thematicBreak: () => R('hr', null, []),
    html: ({ value }) => t.jSXText(value),
    text: ({ value }) => t.jSXText(value || 'SOMETHING IS WRONG'),
    code: props => {
      const { value, lang } = props;
      const [, language, filename, framework] = lang.match(splitLang);
      const html = mySyntaxHighlighting(value, language);

      return NR('Markdown', 'Code', { language, filename, framework, html }, []);
    },
    blockquote: ({ children }, context) => R('blockquote', {}, mapChildren(children, context)),
    inlineCode: ({ value }) => t.jSXText(value),
    link: ({ children, title, url: href }, context) =>
      R('a', { title, href }, mapChildren(children, context)),
    linkReference: ({ children, identifier }, context) => {
      const { title, url: href } = context.definitions[identifier] || { url: '/' };
      return R('a', { title, href }, mapChildren(children, context));
    },
    strong: ({ children }, context) => R('strong', null, mapChildren(children, context)),
    emphasis: ({ children }, context) => R('em', null, mapChildren(children, context)),
    image: ({ title, url: src }) => R('img', { title, src }, []),
    imageReference: ({ identifier }, context) => {
      const { title, url: src } = context.definitions[identifier] || { url: '/' };
      return R('img', { title, src }, []);
    },
    table: ({ children }, context) => {
      const [head, ...tail] = children;
      return R('table', null, [
        R('thead', null, mapChildren([head], context)),
        R('tbody', null, mapChildren(tail, context)),
      ]);
    },
    tableRow: ({ children }, context) => R('tr', null, mapChildren(children, context)),
    tableCell: ({ children }, context) => R('td', null, mapChildren(children, context)),

    ReactComponent: ({ children, options }, context) =>
      NR('Markdown', 'ReactComponent', options, mapChildren(children, context)),
  };

  function endsWith(str, search) {
    return str.indexOf(search, str.length - search.length) !== -1;
  }

  return {
    visitor: {
      ImportDeclaration: {
        exit(path, state) {
          const node = path.node;

          if (endsWith(node.source.value, '.md')) {
            const dir = p.dirname(p.resolve(state.file.opts.filename));
            const absolutePath = p.resolve(dir, node.source.value);
            const markdown = fs.readFileSync(absolutePath, 'utf8');

            const mast = parser(markdown).children;

            const ast = mapChildren(mast).map(
              (item, index) =>
                item || R('h1', null, [t.jSXText(`BROKEN COMPONENT @index=${index}`)])
            );

            path.replaceWith(
              t.variableDeclaration('var', [
                t.variableDeclarator(
                  t.identifier(node.specifiers[0].local.name),
                  t.jSXElement(
                    t.jSXOpeningElement(t.jSXIdentifier('div'), [], false),
                    t.jSXClosingElement(t.jSXIdentifier('div')),
                    ast,
                    false
                  )
                ),
              ])
            );
          }
        },
      },
    },
  };
};
