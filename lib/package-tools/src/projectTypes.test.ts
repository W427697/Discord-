import { installableProjectTypes, SUPPORTED_FRAMEWORKS } from './projectTypes';

describe('installableProjectTypes should have an entry for the supported framework', () => {
  SUPPORTED_FRAMEWORKS.forEach((framework) => {
    it(`${framework}`, () => {
      expect(installableProjectTypes.includes(framework.replace(/-/g, '_'))).toBe(true);
    });
  });
});
