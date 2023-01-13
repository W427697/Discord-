import type { StoryContext } from '@storybook/types';
import { enhanceSource } from './enhanceSource';

// @ts-expect-error (not correct)
const emptyContext: StoryContext = {
  id: 'foo--bar',
  kind: 'foo',
  name: 'bar',
  args: {},
  argTypes: {},
  globals: {},
  parameters: {},
};

describe('addon-docs enhanceSource', () => {
  describe('no source loaded', () => {
    const baseContext = emptyContext;
    it('works', () => {
      // @ts-expect-error (not correct)
      expect(enhanceSource(baseContext)).toEqual('');
    });
  });
  describe('storysource source loaded w/ locationsMap', () => {
    const baseContext = {
      ...emptyContext,
      parameters: {
        storySource: {
          source: 'storySource.source',
          locationsMap: {
            bar: { startBody: { line: 1, col: 5 }, endBody: { line: 1, col: 11 } },
          },
        },
      },
    };
    it('works', () => {
      // @ts-expect-error (not correct)
      expect(enhanceSource(baseContext)).toEqual('Source');
    });
  });
});
