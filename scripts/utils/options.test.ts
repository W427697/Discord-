/// <reference types="jest" />;

import { createCommand } from 'commander';

import type { OptionSpecifier, StringOption, BooleanOption } from './options';
import { getOptions, areOptionsSatisfied, getCommand } from './options';

const allOptions: OptionSpecifier = {
  first: {
    name: 'first',
  },
  second: {
    name: 'second',
    inverse: true,
  },
  third: {
    name: 'third',
    values: ['one', 'two', 'three'],
    required: true,
  },
  fourth: {
    name: 'fourth',
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
      second: true,
    });
  });

  it('deals with inverse boolean options', () => {
    expect(
      getOptions(createCommand() as any, allOptions, ['command', 'name', '--no-second'])
    ).toMatchObject({
      first: undefined,
      second: false,
    });
  });

  it('deals with short options', () => {
    expect(
      getOptions(createCommand() as any, allOptions, ['command', 'name', '-f', '-S'])
    ).toMatchObject({
      first: true,
      second: false,
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
    expect(getCommand('node foo', allOptions, { first: true, second: true })).toBe(
      'node foo --first'
    );
  });

  it('works with inverse boolean options', () => {
    expect(getCommand('node foo', allOptions, { first: false, second: false })).toBe(
      'node foo --no-second'
    );
  });

  it('works with string options', () => {
    expect(getCommand('node foo', allOptions, { second: true, third: 'one' })).toBe(
      'node foo --third one'
    );
  });

  it('works with multiple string options', () => {
    expect(getCommand('node foo', allOptions, { second: true, fourth: ['a', 'b'] })).toBe(
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
    ).toBe('node foo --first --no-second --fourth a --fourth b');
  });
});
