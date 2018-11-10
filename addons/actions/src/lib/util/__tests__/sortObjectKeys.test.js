import sortObjectKeys from '../sortObjectKeys';

describe('sortObjectKeys', () => {
  it('sorts an array in alphabetical order', () => {
    expect(['c', 'd', 'a', 'c', 'b'].sort(sortObjectKeys)).toEqual(['a', 'b', 'c', 'c', 'd']);
  });

  it('sorts an array in numerical order', () => {
    expect(['3', '2', '1', '10', '0'].sort(sortObjectKeys)).toEqual(['0', '1', '2', '3', '10']);
  });

  it('sorts an array in numerical and alphabetical order', () => {
    expect(['a', '_', '2', '1', '10', 'b', '0'].sort(sortObjectKeys)).toEqual([
      '0',
      '1',
      '2',
      '10',
      '_',
      'a',
      'b',
    ]);
  });
});
