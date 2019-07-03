import { removeDocsOnlyStories } from './nav';

describe('docs-only story filtering', () => {
  const docsOnly = { parameters: { docsOnly: true } };
  const stories = {
    root: { id: 'root', parent: false, children: ['a', 'b'] },
    a: { id: 'a', parent: 'root' },
    b: { id: 'b', parent: 'root', children: ['b1', 'b2'] },
    b1: { id: 'b1', parent: 'b' },
    b2: { id: 'b2', parent: 'b' },
  };

  it('ignores normal stories', () => {
    const filtered = removeDocsOnlyStories(stories);
    expect(Object.keys(filtered)).toEqual(Object.keys(stories));
  });

  it('filters out docs-only stories', () => {
    const hasDocsOnly = {
      ...stories,
      b2: { ...stories.b2, ...docsOnly },
    };
    const filtered = removeDocsOnlyStories(hasDocsOnly);
    expect(Object.keys(filtered)).toEqual(['root', 'a', 'b', 'b1']);
    expect(filtered.b.children).toEqual(['b1']);
  });

  it('filters out docs-only stories hierarchically', () => {
    const hierarchicalDocsOnly = {
      ...stories,
      b1: { ...stories.b1, ...docsOnly },
      b2: { ...stories.b2, ...docsOnly },
    };
    const filtered = removeDocsOnlyStories(hierarchicalDocsOnly);
    expect(Object.keys(filtered)).toEqual(['root', 'a']);
    expect(filtered.root.children).toEqual(['a']);
  });
});
