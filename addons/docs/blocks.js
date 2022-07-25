import deprecate from 'util-deprecate';
import { dedent } from 'ts-dedent';

import './dist/blocks';

const warnBlocksImport = deprecate(
  () => {},
  dedent`
    Importing from '@storybook/addon-docs/blocks' is deprecated, import directly from '@storybook/addon-docs' instead:
    
    https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-scoped-blocks-imports
`
);
warnBlocksImport();
