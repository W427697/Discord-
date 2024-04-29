import { describe, expect, it } from 'vitest';
import { extractSeededRequiredArgs } from './FileSearchModal.utils';
import type { ArgTypes } from '@storybook/csf';

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
            value: [],
          },
          options: ['a', 'b', 'c'],
        },
        union: {
          type: { name: 'union', required: false, value: [] },
        },
        enumRequired: {
          type: {
            name: 'enum',
            required: true,
            value: [],
          },
          options: ['a', 'b', 'c'],
        },
        enum: {
          type: { name: 'union', required: false, value: [] },
        },
        otherObject: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'object' },
        },
        otherInlineRadio: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'inline-radio', options: ['a', 'b', 'c'] },
        },
        otherRadio: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'radio', options: ['d', 'e', 'f'] },
        },
        otherInlineCheck: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'inline-check', options: ['g', 'h', 'i'] },
        },
        otherCheck: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'check', options: ['j', 'k', 'l'] },
        },
        otherSelect: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'select', options: ['m', 'n', 'o'] },
        },
        otherMultiSelect: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'multi-select', options: ['p', 'q', 'r'] },
        },
        otherColor: {
          type: { name: 'other', required: true, value: '' },
          control: { type: 'color' },
        },
      } as ArgTypes;

      expect(extractSeededRequiredArgs(argTypes)).toEqual({
        booleanRequired: true,
        enumRequired: 'a',
        functionRequired: expect.any(Function),
        numberRequired: 0,
        otherCheck: 'j',
        otherColor: '#000000',
        otherInlineCheck: 'g',
        otherInlineRadio: 'a',
        otherMultiSelect: 'p',
        otherObject: {},
        otherRadio: 'd',
        otherSelect: 'm',
        stringRequired: 'stringRequired',
        unionRequired: 'a',
      });
    });
  });
});
