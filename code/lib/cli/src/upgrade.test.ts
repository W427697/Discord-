import { addExtraFlags, getStorybookVersion, isCorePackage } from './upgrade';

describe.each([
  ['│ │ │ ├── @babel/code-frame@7.10.3 deduped', null],
  [
    '│ ├── @junk-temporary-prototypes/theming@6.0.0-beta.37 extraneous',
    { package: '@junk-temporary-prototypes/theming', version: '6.0.0-beta.37' },
  ],
  [
    '├─┬ @junk-temporary-prototypes/preset-create-react-app@3.1.2',
    { package: '@junk-temporary-prototypes/preset-create-react-app', version: '3.1.2' },
  ],
  ['│ ├─┬ @junk-temporary-prototypes/node-logger@5.3.19', { package: '@junk-temporary-prototypes/node-logger', version: '5.3.19' }],
  [
    'npm ERR! peer dep missing: @junk-temporary-prototypes/react@>=5.2, required by @junk-temporary-prototypes/preset-create-react-app@3.1.2',
    null,
  ],
])('getStorybookVersion', (input, output) => {
  it(`${input}`, () => {
    expect(getStorybookVersion(input)).toEqual(output);
  });
});

describe.each([
  ['@junk-temporary-prototypes/react', true],
  ['@junk-temporary-prototypes/node-logger', true],
  ['@junk-temporary-prototypes/addon-info', true],
  ['@junk-temporary-prototypes/something-random', true],
  ['@junk-temporary-prototypes/preset-create-react-app', false],
  ['@junk-temporary-prototypes/linter-config', false],
  ['@junk-temporary-prototypes/design-system', false],
])('isCorePackage', (input, output) => {
  it(`${input}`, () => {
    expect(isCorePackage(input)).toEqual(output);
  });
});

describe('extra flags', () => {
  const extraFlags = {
    'react-scripts@<5': ['--foo'],
  };
  const devDependencies = {};
  it('package matches constraints', () => {
    expect(
      addExtraFlags(extraFlags, [], { dependencies: { 'react-scripts': '4' }, devDependencies })
    ).toEqual(['--foo']);
  });
  it('package prerelease matches constraints', () => {
    expect(
      addExtraFlags(extraFlags, [], {
        dependencies: { 'react-scripts': '4.0.0-alpha.0' },
        devDependencies,
      })
    ).toEqual(['--foo']);
  });
  it('package not matches constraints', () => {
    expect(
      addExtraFlags(extraFlags, [], {
        dependencies: { 'react-scripts': '5.0.0-alpha.0' },
        devDependencies,
      })
    ).toEqual([]);
  });
  it('no package not matches constraints', () => {
    expect(
      addExtraFlags(extraFlags, [], {
        dependencies: {},
        devDependencies,
      })
    ).toEqual([]);
  });
});
