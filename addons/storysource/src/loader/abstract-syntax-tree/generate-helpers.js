import prettier from 'prettier';
import { patchNode } from './parse-helpers';
import {
  splitSTORYOF,
  findAddsMap,
  findDependencies,
  splitExports,
  findExportsMap as generateExportsMap,
} from './traverse-helpers';

function isUglyComment(comment, uglyCommentsRegex) {
  return uglyCommentsRegex.some(regex => regex.test(comment));
}

function generateSourceWithoutUglyComments(source, { comments, uglyCommentsRegex }) {
  let lastIndex = 0;
  const parts = [source];

  comments
    .filter(comment => isUglyComment(comment.value.trim(), uglyCommentsRegex))
    .map(patchNode)
    .forEach(comment => {
      parts.pop();

      const start = source.slice(lastIndex, comment.start);
      const end = source.slice(comment.end);

      parts.push(start, end);
      lastIndex = comment.end;
    });

  return parts.join('');
}

function prettifyCode(source, { prettierConfig, parser, filepath }) {
  let config = prettierConfig;
  let foundParser = null;
  if (parser === 'javascript' || /jsx?/.test(parser)) foundParser = 'babel';
  if (parser === 'typescript' || /tsx?/.test(parser)) foundParser = 'typescript';
  if (!config.parser) {
    if (foundParser) {
      config = {
        ...prettierConfig,
        parser: foundParser,
      };
    } else if (filepath) {
      config = {
        ...prettierConfig,
        filepath,
      };
    } else {
      config = {
        ...prettierConfig,
        parser: 'babel',
      };
    }
  }

  try {
    return prettier.format(source, config);
  } catch (e) {
    // Can fail when the source is a JSON
    return source;
  }
}

const STORY_DECORATOR_STATEMENT =
  '.addDecorator(withStorySource(__STORY__, __ADDS_MAP__,__MAIN_FILE_LOCATION__,__MODULE_DEPENDENCIES__,__LOCAL_DEPENDENCIES__,__SOURCE_PREFIX__,__IDS_TO_FRAMEWORKS__))';

const IMPORT_DECLARATION_FOR_EXPORTED_STORIES_DECORATOR =
  'var addStorySourceDecorator = require("@storybook/addon-storysource").addStorySourceDecorator;\n';
const applyExportDecoratorStatement = part =>
  ` addStorySourceDecorator(${part}, {__STORY__, __ADDS_MAP__,__MAIN_FILE_LOCATION__,__MODULE_DEPENDENCIES__,__LOCAL_DEPENDENCIES__,__SOURCE_PREFIX__,__IDS_TO_FRAMEWORKS__});`;

export function generateSourceWithDecorators(source, ast) {
  const { comments = [] } = ast;

  const partsUsingStoryOfToken = splitSTORYOF(ast, source);

  if (partsUsingStoryOfToken.length > 1) {
    const newSource = partsUsingStoryOfToken.join(STORY_DECORATOR_STATEMENT);

    return {
      storyOfTokenFound: true,
      changed: partsUsingStoryOfToken.length > 1,
      source: newSource,
      comments,
    };
  }

  const partsUsingExports = splitExports(ast, source);

  const newSource =
    IMPORT_DECLARATION_FOR_EXPORTED_STORIES_DECORATOR +
    partsUsingExports
      .map((part, i) => (i % 2 === 0 ? part : applyExportDecoratorStatement(part)))
      .join('');

  return {
    exportTokenFound: true,
    changed: partsUsingExports.length > 1,
    source: newSource,
    comments,
  };
}

export function generateSourceWithoutDecorators(source, ast) {
  const { comments = [] } = ast;

  return {
    changed: true,
    source,
    comments,
  };
}

export function generateAddsMap(ast, storiesOfIdentifiers) {
  return findAddsMap(ast, storiesOfIdentifiers);
}

export function generateStoriesLocationsMap(ast, storiesOfIdentifiers) {
  const usingAddsMap = generateAddsMap(ast, storiesOfIdentifiers);
  const { addsMap } = usingAddsMap;

  if (Object.keys(addsMap).length > 0) {
    return usingAddsMap;
  }
  const usingExportsMap = generateExportsMap(ast);

  return usingExportsMap || usingAddsMap;
}

export function generateDependencies(ast) {
  return findDependencies(ast);
}

export function generateStorySource({ source, ...options }) {
  let storySource = source;

  storySource = generateSourceWithoutUglyComments(storySource, options);
  storySource = prettifyCode(storySource, options);

  return storySource;
}
