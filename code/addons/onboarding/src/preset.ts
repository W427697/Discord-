import type { CoreConfig, Options } from '@storybook/core/dist/types';
import type { Channel } from '@storybook/core/dist/channels';
import { STORYBOOK_ADDON_ONBOARDING_CHANNEL } from './constants';
import { telemetry } from '@storybook/core/dist/telemetry';
import fs from 'fs';

type Event = {
  type: 'telemetry';
  step: string;
  payload?: any;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_serverChannel = async (channel: Channel, options: Options) => {
  const { disableTelemetry } = await options.presets.apply<CoreConfig>('core', {});

  if (!disableTelemetry) {
    const packageJsonPath = require.resolve('@storybook/addon-onboarding/package.json');

    const { version: addonVersion } = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
    );

    channel.on(STORYBOOK_ADDON_ONBOARDING_CHANNEL, ({ type, ...event }: Event) => {
      if (type === 'telemetry') {
        // @ts-expect-error (bad string)
        telemetry('addon-onboarding', {
          ...event,
          addonVersion,
        });
      }
    });
  }

  return channel;
};
