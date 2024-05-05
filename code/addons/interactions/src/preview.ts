import type { PlayFunction, PlayFunctionContext, StepLabel } from '@storybook/core/dist/types';
import { instrument } from '@storybook/core/dist/instrumenter';

export const { step: runStep } = instrument(
  {
    step: (label: StepLabel, play: PlayFunction, context: PlayFunctionContext<any>) =>
      play(context),
  },
  { intercept: true }
);

export const parameters = {
  throwPlayFunctionExceptions: false,
};
