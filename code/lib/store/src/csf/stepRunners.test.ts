import { PlayFunctionContext, StepRunner } from '@storybook/csf';
import { composeStepRunners } from './stepRunners';

describe('stepRunners', () => {
  it('composes each step runner', async () => {
    const firstLabels: string[] = [];
    const firstStepRunner: StepRunner = async (label, play, ctx) => {
      firstLabels.push(label);
      return play(ctx);
    };

    const secondLabels: string[] = [];
    const secondStepRunner: StepRunner = async (label, play, ctx) => {
      secondLabels.push(label);
      return play(ctx);
    };

    const composed = composeStepRunners([firstStepRunner, secondStepRunner]);

    const playFnA = jest.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = jest.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
    expect(firstLabels).toEqual(['a', 'b']);
    expect(secondLabels).toEqual(['a', 'b']);
  });

  it('creates a sensible default if no step runner is provided', async () => {
    const composed = composeStepRunners([]);

    const playFnA = jest.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = jest.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
  });
});
