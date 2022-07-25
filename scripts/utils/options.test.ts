/// <reference types="jest" />;

import { createCommand } from 'commander';

import type { OptionSpecifier, StringOption, BooleanOption } from './options';
import { getOptions, areOptionsSatisfied, getCommand } from './options';

const allOptions: OptionSpecifier = {
  first: {
    name: 'first',
    flags: '-f, --first',
  },
  second: {
    name: 'second',
    flags: '-s, --second',
  },
  third: {
    name: 'third',
    flags: '-t, --third <value>',
    values: ['one', 'two', 'three'],
    required: true,
  },
  fourth: {
    name: 'fourth',
    flags: '-f, --fourth <value>',
    values: ['a', 'b', 'c'],
    multiple: true,
  },
};

describe('getOptions', () => {
  it('deals with boolean options', () => {
    expect(
      getOptions(createCommand() as any, allOptions, ['command', 'name', '--first'])
    ).toMatchObject({
      first: true,
      second: undefined,
    });
  });

  it('deals with string options', () => {
    expect(
      getOptions(createCommand() as any, allOptions, ['command', 'name', '--third', 'one'])
    ).toMatchObject({
      third: 'one',
    });
  });

  it('deals with multiple string options', () => {
    expect(
      getOptions(createCommand() as any, allOptions, ['command', 'name', '--fourth', 'a'])
    ).toMatchObject({
      fourth: ['a'],
    });

    expect(
      getOptions(createCommand() as any, allOptions, [
        'command',
        'name',
        '--fourth',
        'a',
        '--fourth',
        'b',
      ])
    ).toMatchObject({
      fourth: ['a', 'b'],
    });
  });
});

describe('areOptionsSatisfied', () => {
  it('checks each required string option has a value', () => {
    expect(areOptionsSatisfied(allOptions, { fourth: ['a', 'c'] })).toBe(false);
    expect(areOptionsSatisfied(allOptions, { third: ['one'] })).toBe(true);
  });
});

describe('getCommand', () => {
  it('works with boolean options', () => {
    expect(getCommand('node foo', allOptions, { first: true, second: false })).toBe(
      'node foo --first'
    );
  });

  it('works with string options', () => {
    expect(getCommand('node foo', allOptions, { third: 'one' })).toBe('node foo --third one');
  });

  it('works with multiple string options', () => {
    expect(getCommand('node foo', allOptions, { fourth: ['a', 'b'] })).toBe(
      'node foo --fourth a --fourth b'
    );
  });

  it('works with combinations string options', () => {
    expect(
      getCommand('node foo', allOptions, {
        first: true,
        second: false,
        fourth: ['a', 'b'],
      })
    ).toBe('node foo --first --fourth a --fourth b');
  });
});
