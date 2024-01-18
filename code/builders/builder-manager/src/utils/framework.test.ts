import { describe, it, expect } from 'vitest';

import {
  pluckNameFromConfigProperty,
  pluckStorybookPackageFromPath,
  pluckThirdPartyPackageFromPath,
} from './framework';

describe('UTILITIES: Framework information', () => {
  describe('UTILITY: pluckNameFromConfigProperty', () => {
    it('should return undefined if the property is undefined', () => {
      expect(pluckNameFromConfigProperty(undefined)).toBe(undefined);
    });

    it('should return the name if the property is a string', () => {
      expect(pluckNameFromConfigProperty('foo')).toBe('foo');
    });

    it('should return the name if the property is an object', () => {
      expect(pluckNameFromConfigProperty({ name: 'foo' })).toBe('foo');
    });
  });

  describe('UTILITY: pluckStorybookPackageFromPath', () => {
    it('should return the package name if the path is a storybook package', () => {
      expect(pluckStorybookPackageFromPath('@storybook/foo')).toBe('@storybook/foo');
    });

    it('should return undefined if the path is not a storybook package', () => {
      expect(pluckStorybookPackageFromPath('foo')).toBe(undefined);
    });
  });

  describe('UTILITY: pluckThirdPartyPackageFromPath', () => {
    it('should return the package name if the path is a third party package', () => {
      expect(pluckThirdPartyPackageFromPath('foo/node_modules/bar')).toBe('bar');
    });

    it('should return the given path if the path is not a third party package', () => {
      expect(pluckThirdPartyPackageFromPath('foo/bar/baz')).toBe('foo/bar/baz');
    });
  });
});
