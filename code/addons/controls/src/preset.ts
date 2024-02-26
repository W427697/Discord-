import { readFile, writeFile } from 'fs/promises';
import camelCase from 'lodash/camelCase.js';
import upperFirst from 'lodash/upperFirst.js';
import { dedent } from 'ts-dedent';

import { storyNameFromExport, toId } from '@storybook/csf';
import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { SAVE_STORY, STORY_SAVED } from './constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_serverChannel = async (channel: Channel, options: Options) => {
  channel.on(SAVE_STORY, async (data) => {
    const key = upperFirst(camelCase(data.name));
    const updatedArgs = Object.keys(data.args)
      .map((arg) => `    ${arg}: ${JSON.stringify(data.args[arg])}`)
      .join(',\n')
      .trim();

    const optName = storyNameFromExport(key) === data.name ? '' : `\n  name: '${data.name}',`;

    const story = dedent`
      export const ${key} = {
        ...${data.baseName},${optName}
        args: {
          ...${data.baseName}.args,
          ${updatedArgs}
        }
      }
    `;

    const existing = await readFile(data.importPath, 'utf8');
    await writeFile(data.importPath, `${existing}\n${story}`);

    await new Promise((r) => setTimeout(r, 1000));
    channel.emit(STORY_SAVED, { id: toId(data.title, key) });
  });
  return channel;
};
