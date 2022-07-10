import { AnyFramework, StepRunner } from '@storybook/csf';

export function composeStepRunners<TFramework extends AnyFramework>(
  stepRunners: StepRunner<TFramework>[]
): StepRunner<TFramework> {
  return async (label, play, playContext) => {
    const composedPlay = await stepRunners.reduce(
      async (innerPlay, stepRunner) => async () => stepRunner(label, await innerPlay, playContext),
      Promise.resolve(play)
    );
    await composedPlay(playContext);
  };
}
