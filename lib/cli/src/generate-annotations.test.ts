import dedent from 'ts-dedent';
import * as generateAnnotations from './generate-annotations';

describe('generateAnnotations', () => {
  describe('getAnnotationsFileContent', () => {
    test('should fix preview path if it is relative to the same folder', () => {
      const content = generateAnnotations.getAnnotationsFileContent(['preview.ts']);
      expect(content).toEqual(dedent`
        import * as projectAnnotations from "./preview.ts";

        export default [projectAnnotations];
      `);
    });

    test('should replace esm with cjs', () => {
      const content = generateAnnotations.getAnnotationsFileContent([
        '../node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js',
      ]);

      expect(content).toEqual(dedent`
        import * as addonPreset from "@storybook/addon-actions/dist/esm/preset/addDecorator.js";
        
        export default [addonPreset];
      `);
    });

    test('should separate frameworks, addons and project annotations', () => {
      const content = generateAnnotations.getAnnotationsFileContent([
        '../node_modules/@storybook/react/dist/esm/client/docs/config',
        '../node_modules/@storybook/react/dist/esm/client/preview/config',
        '../node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js',
        '../node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js',
        '../node_modules/@storybook/addon-interactions/dist/esm/preset/argsEnhancers',
        'preview.ts',
      ]);

      expect(content).toEqual(dedent`
        import * as frameworkPreset from "@storybook/react/dist/esm/client/docs/config";
        import * as frameworkPreset2 from "@storybook/react/dist/esm/client/preview/config";
        import * as addonPreset from "@storybook/addon-actions/dist/esm/preset/addDecorator.js";
        import * as addonPreset2 from "@storybook/addon-actions/dist/esm/preset/addArgs.js";
        import * as addonPreset3 from "@storybook/addon-interactions/dist/esm/preset/argsEnhancers";
        import * as projectAnnotations from "./preview.ts";
        
        export default [frameworkPreset, frameworkPreset2, addonPreset, addonPreset2, addonPreset3, projectAnnotations];
      `);
    });
  });
});
