import { useEffect } from 'react';
import { addons } from '@storybook/addons';

import { AnyFunctionReturns } from '../../shared/types.d';

export { Channel } from '@storybook/channels';

/**
 * The React hook version of Storybook Channel API.
 */
type UseChannel = (
  event: string,
  eventHandler: AnyFunctionReturns<void>,
  input?: unknown[]
) => void;

export const useChannel: UseChannel = (event, eventHandler, inputs = []) =>
  useEffect(() => {
    const channel = addons.getChannel();
    channel.on(event, eventHandler);
    return () => channel.removeListener(event, eventHandler);
  }, inputs);
