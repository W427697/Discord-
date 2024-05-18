import { describe, it, expect, vi } from 'vitest';
import type { PlayFunctionContext, StepRunner } from '@storybook/core/dist/types';
import { composeStepRunners } from './stepRunners';

describe('stepRunners', () => {
  it('composes each step runner', async () => {
    const order: string[] = [];

    const firstStepRunner: StepRunner = async (label, play, ctx) => {
      order.push(`first-${label}-start`);
      await play(ctx);
      order.push(`first-${label}-end`);
    };

    const secondStepRunner: StepRunner = async (label, play, ctx) => {
      order.push(`second-${label}-start`);
      await play(ctx);
      order.push(`second-${label}-end`);
    };

    const composed = composeStepRunners([firstStepRunner, secondStepRunner]);

    const playFnA = vi.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = vi.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
    expect(order).toEqual([
      'first-a-start',
      'second-a-start',
      'second-a-end',
      'first-a-end',
      'first-b-start',
      'second-b-start',
      'second-b-end',
      'first-b-end',
    ]);
  });

  it('creates a sensible default if no step runner is provided', async () => {
    const composed = composeStepRunners([]);

    const playFnA = vi.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = vi.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
  });
});
