import parseJs from 'prettier/parser-babylon';
import estraverse from 'estraverse';

const STORIES_OF = 'storiesOf';

function pushParts(source, parts, from, to) {
  const start = source.slice(from, to);
  parts.push(start);

  const end = source.slice(to);
  parts.push(end);
}

export function patchNode(node) {
  if (node.range && node.range.length === 2 && node.start === undefined && node.end === undefined) {
    const [start, end] = node.range;

    // eslint-disable-next-line no-param-reassign
    node.start = start;
    // eslint-disable-next-line no-param-reassign
    node.end = end;
  }

  if (!node.range && node.start !== undefined && node.end !== undefined) {
    // eslint-disable-next-line no-param-reassign
    node.range = [node.start, node.end];
  }

  return node;
}

export function handleSTORYOF(node, parts, source, lastIndex) {
  if (!node.callee || !node.callee.name || node.callee.name !== STORIES_OF) {
    return lastIndex;
  }

  parts.pop();
  pushParts(source, parts, lastIndex, node.end);
  return node.end;
}

function splitSTORYOF(ast, source) {
  let lastIndex = 0;
  const parts = [source];

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);

      if (node.type === 'CallExpression') {
        lastIndex = handleSTORYOF(node, parts, source, lastIndex);
      }
    },
  });

  return parts;
}

export function split(source) {
  const ast = parseJs.parsers.babel.parse(source);

  return splitSTORYOF(ast, source);
}
