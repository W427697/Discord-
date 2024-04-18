import { describe, expect, it } from 'vitest';
import { extractSeededRequiredArgs, trySelectNewStory } from './FileSearchModal.utils';
import type { ArgTypes, SBType } from '@storybook/csf';

describe('FileSearchModal.utils', () => {
  describe('extractSeededRequiredArgs', () => {
    it('should extract seeded required args', () => {
      const argTypes = {
        stringRequired: {
          type: { name: 'string', required: true },
        },
        string: {
          type: { name: 'string', required: false },
        },
        numberRequired: {
          type: { name: 'number', required: true },
        },
        number: {
          type: { name: 'number', required: false },
        },
        booleanRequired: {
          type: { name: 'boolean', required: true },
        },
        boolean: {
          type: { name: 'boolean', required: false },
        },
        functionRequired: {
          type: { name: 'function', required: true },
        },
        function: {
          type: { name: 'function', required: false },
        },
        unionRequired: {
          type: {
            name: 'union',
            required: true,
            value: ['a', 'b', 'c'] as any,
          },
        },
        union: {
          type: { name: 'union', required: false, value: [] },
        },
        enumRequired: {
          type: {
            name: 'enum',
            required: true,
            value: ['a', 'b', 'c'] as any,
          },
        },
        enum: {
          type: { name: 'union', required: false, value: [] },
        },
      } as ArgTypes;

      expect(extractSeededRequiredArgs(argTypes)).toEqual({
        stringRequired: 'stringRequired',
        numberRequired: 0,
        booleanRequired: true,
        functionRequired: expect.any(Function),
        unionRequired: 'a',
        enumRequired: 'a',
      });
    });
  });
});
