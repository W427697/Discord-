/* eslint-disable no-underscore-dangle */
import prettier from 'prettier';
import { formatCsf, loadCsf } from '@storybook/csf-tools';
import { jscodeshiftToPrettierParser } from '../lib/utils';

const logger = console;

function transform({ source }: { source: string }, api: any, options: { parser?: string }) {
  const makeTitle = (userTitle?: string) => {
    return userTitle || 'FIXME';
  };
  const csf = loadCsf(source, { makeTitle });

  try {
    csf.parse();
  } catch (err) {
    logger.log(`Error ${err}, skipping`);
    return source;
  }

  const updatedBody = csf._ast.program.body;
  csf._ast.program.body = updatedBody;
  const output = formatCsf(csf);

  const prettierConfig = prettier.resolveConfig.sync('.', { editorconfig: true }) || {
    printWidth: 100,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
  };

  return prettier.format(output, {
    ...prettierConfig,
    parser: jscodeshiftToPrettierParser(options?.parser),
  });
}

export default transform;
