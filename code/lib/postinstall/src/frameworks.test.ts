import { getFrameworks } from './frameworks';

const REACT = {
  '@junk-temporary-prototypes/react': '5.2.5',
};

const VUE = {
  '@junk-temporary-prototypes/vue': '5.2.5',
};

const NONE = {
  '@junk-temporary-prototypes/preview-api': '5.2.5',
  lodash: '^4.17.15',
};

describe('getFrameworks', () => {
  it('single framework', () => {
    const frameworks = getFrameworks({
      dependencies: NONE,
      devDependencies: REACT,
    });
    expect(frameworks).toEqual(['react']);
  });
  it('multi-framework', () => {
    const frameworks = getFrameworks({
      dependencies: VUE,
      devDependencies: REACT,
    });
    expect(frameworks.sort()).toEqual(['react', 'vue']);
  });
  it('no deps', () => {
    const frameworks = getFrameworks({});
    expect(frameworks).toEqual([]);
  });
  it('no framework', () => {
    const frameworks = getFrameworks({
      dependencies: NONE,
    });
    expect(frameworks).toEqual([]);
  });
});
