import { filterPresetsConfig } from './presets';

describe('filterPresetsConfig', () => {
  it('string config', () => {
    expect(filterPresetsConfig(['@junk-temporary-prototypes/preset-scss', '@junk-temporary-prototypes/preset-typescript'])).toEqual(
      ['@junk-temporary-prototypes/preset-scss']
    );
  });

  it('windows paths', () => {
    expect(filterPresetsConfig(['a', '@junk-temporary-prototypes\\preset-typescript'])).toEqual(['a']);
  });

  it('object config', () => {
    const tsConfig = {
      name: '@junk-temporary-prototypes/preset-typescript',
      options: { foo: 1 },
    };
    expect(filterPresetsConfig([tsConfig, 'a'])).toEqual(['a']);
  });
});
