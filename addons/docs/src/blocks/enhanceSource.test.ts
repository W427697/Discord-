import { StoryContext } from '@storybook/addons';
import { enhanceSource } from './enhanceSource';

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
    it('no transformSource', () => {
      expect(enhanceSource(baseContext)).toBeNull();
    });
    it('transformSource', () => {
      const transformSource = (src?: string) => (src ? `formatted: ${src}` : 'no src');
      const parameters = { ...baseContext.parameters, docs: { transformSource } };
      expect(enhanceSource({ ...baseContext, parameters })).toBeNull();
    });
  });
  describe('custom/mdx source loaded', () => {
    const baseContext = {
      ...emptyContext,
      parameters: { storySource: { source: 'storySource.source' } },
    };
    it('no transformSource', () => {
      expect(enhanceSource(baseContext)).toEqual({
        docs: { source: { code: 'storySource.source' } },
      });
    });
    it('transformSource', () => {
      const transformSource = (src?: string) => (src ? `formatted: ${src}` : 'no src');
      const parameters = { ...baseContext.parameters, docs: { transformSource } };
      expect(enhanceSource({ ...baseContext, parameters }).docs.source).toEqual({
        code: 'formatted: storySource.source',
      });
    });
    it('receives StoryContext as second argument', () => {
      const transformSource = jest.fn();
      const parameters = { ...baseContext.parameters, docs: { transformSource } };
      const context = { ...baseContext, parameters };
      enhanceSource(context);
      expect(transformSource).toHaveBeenCalledWith(
        baseContext.parameters.storySource.source,
        baseContext.id,
        context
      );
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
    it('no transformSource', () => {
      expect(enhanceSource(baseContext)).toEqual({ docs: { source: { code: 'Source' } } });
    });
    it('transformSource', () => {
      const transformSource = (src?: string) => (src ? `formatted: ${src}` : 'no src');
      const parameters = { ...baseContext.parameters, docs: { transformSource } };
      expect(enhanceSource({ ...baseContext, parameters }).docs.source).toEqual({
        code: 'formatted: Source',
      });
    });
  });
  describe('custom docs.source provided', () => {
    const baseContext = {
      ...emptyContext,
      parameters: {
        storySource: { source: 'storySource.source' },
        docs: { source: { code: 'docs.source.code' } },
      },
    };
    it('no transformSource', () => {
      expect(enhanceSource(baseContext)).toBeNull();
    });
    it('transformSource', () => {
      const transformSource = (src?: string) => (src ? `formatted: ${src}` : 'no src');
      const { source } = baseContext.parameters.docs;
      const parameters = { ...baseContext.parameters, docs: { source, transformSource } };
      expect(enhanceSource({ ...baseContext, parameters })).toBeNull();
    });
  });
});
