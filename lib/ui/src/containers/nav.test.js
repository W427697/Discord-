import { removeDocsOnlyStories, flattenDocsOnlyStories } from './nav';

const docsOnly = { parameters: { docsOnly: true } };
const root = { id: 'root', parent: false, children: ['a', 'b'] };
const a = { id: 'a', parent: 'root' };
const b = { id: 'b', parent: 'root', children: ['b1', 'b2'] };
const b1 = { id: 'b1', isLeaf: true, parent: 'b' };
const b2 = { id: 'b2', isLeaf: true, parent: 'b' };
const stories = { root, a, b, b1, b2 };

describe('docs-only story filtering', () => {
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

describe('docs-only story flattening', () => {
  it('ignores normal stories', () => {
    const filtered = flattenDocsOnlyStories(stories);
    expect(Object.keys(filtered)).toEqual(Object.keys(stories));
  });

  it('filters out docs-only stories', () => {
    const hasDocsOnly = {
      root,
      a,
      b: { ...b, children: ['b1'] },
      b1: { ...b1, ...docsOnly },
    };
    const filtered = flattenDocsOnlyStories(hasDocsOnly);
    expect(Object.keys(filtered)).toEqual(['root', 'a', 'b']);
    expect(filtered.b.id).toEqual('b1');
    expect(filtered.b.isLeaf).toEqual(true);
  });
});
