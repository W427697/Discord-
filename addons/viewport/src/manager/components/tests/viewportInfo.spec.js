import { initialViewports, resetViewport, configuredStyles, applyStyles } from '../viewportInfo';

describe('Viewport/constants', () => {
  describe('initialViewports', () => {
    it('includes the default styles on every custom viewport', () => {
      const keys = Object.keys(initialViewports);

      keys.forEach(key => {
        expect(initialViewports[key].styles).toEqual(expect.objectContaining(configuredStyles));
      });
    });
  });

  describe('resetViewport', () => {
    it('does not include the styles for a responsive iframe', () => {
      expect(resetViewport).not.toEqual(expect.objectContaining(configuredStyles));
    });
  });

  describe('applyStyles', () => {
    it('creates a new viewport with all given styles applied', () => {
      const viewport = {
        styles: {
          width: '50px',
        },
      };
      const styles = {
        foo: 'bar',
        john: 'doe',
      };
      const newViewport = applyStyles(viewport, styles);

      expect(newViewport.styles).toEqual(
        expect.objectContaining({
          width: '50px',
          foo: 'bar',
          john: 'doe',
        })
      );
    });
  });
});
