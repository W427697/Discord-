import { autoTitleFromEntry as auto } from './autoTitle';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
});

describe('autoTitle', () => {
  it('no directory', () => {
    expect(auto('/path/to/file', { glob: '' })).toBeFalsy();
  });

  it('no match', () => {
    expect(auto('/path/to/file', { glob: '', specifier: { directory: '/other' } })).toBeFalsy();
  });

  describe('no trailing slash', () => {
    it('match with no titlePrefix', () => {
      expect(
        auto('/path/to/file', { glob: '', specifier: { directory: '/path' } })
      ).toMatchInlineSnapshot(`to/file`);
    });

    it('match with titlePrefix', () => {
      expect(
        auto('/path/to/file', { glob: '', specifier: { directory: '/path', titlePrefix: 'atoms' } })
      ).toMatchInlineSnapshot(`atoms/to/file`);
    });

    it('match with extension', () => {
      expect(
        auto('/path/to/file.stories.tsx', {
          glob: '',
          specifier: { directory: '/path', titlePrefix: 'atoms' },
        })
      ).toMatchInlineSnapshot(`atoms/to/file`);
    });
  });

  describe('trailing slash', () => {
    it('match with no titlePrefix', () => {
      expect(
        auto('/path/to/file', { glob: '', specifier: { directory: '/path/' } })
      ).toMatchInlineSnapshot(`to/file`);
    });

    it('match with titlePrefix', () => {
      expect(
        auto('/path/to/file', {
          glob: '',
          specifier: { directory: '/path/', titlePrefix: 'atoms' },
        })
      ).toMatchInlineSnapshot(`atoms/to/file`);
    });

    it('match with extension', () => {
      expect(
        auto('/path/to/file.stories.tsx', {
          glob: '',
          specifier: { directory: '/path/', titlePrefix: 'atoms' },
        })
      ).toMatchInlineSnapshot(`atoms/to/file`);
    });
  });
});
