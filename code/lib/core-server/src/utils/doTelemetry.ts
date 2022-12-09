import type { CoreConfig, Options } from '@storybook/types';
import { telemetry } from '@storybook/telemetry';
import { useStorybookMetadata } from './metadata';
import type { StoryIndexGenerator } from './StoryIndexGenerator';
import { summarizeIndex } from './summarizeIndex';
import { router } from './router';
import { versionStatus } from './versionStatus';

export async function doTelemetry(
  core: CoreConfig,
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>,
  options: Options
) {
  if (!core?.disableTelemetry) {
    initializedStoryIndexGenerator.then(async (generator) => {
      const storyIndex = await generator?.getIndex();
      const { versionCheck, versionUpdates } = options;
      const payload = storyIndex
        ? {
            versionStatus: versionUpdates ? versionStatus(versionCheck) : 'disabled',
            storyIndex: summarizeIndex(storyIndex),
          }
        : undefined;
      telemetry('dev', payload, { configDir: options.configDir });
    });
  }

  if (!core?.disableProjectJson) {
    useStorybookMetadata(router, options.configDir);
  }
}
