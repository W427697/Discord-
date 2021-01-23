import parseStories from './parse-stories';
import TestStories from './components/__tests__/TestStories.svelte';

describe('parse-stories', () => {
  test('Extract Stories', () => {
    const stories = parseStories({ default: TestStories }, { 'tpl:tpl2': 'tpl2src' });
    expect(stories.default).toMatchInlineSnapshot(`
      Object {
        "title": "Test",
      }
    `);

    expect(stories['0'].storyName).toBe('Story1');
    expect(stories['0'].parameters).toMatchInlineSnapshot(`undefined`);
    expect(stories['1'].storyName).toBe('Story2');
    expect(stories['1'].parameters).toMatchInlineSnapshot(`undefined`);
    expect(stories['2'].storyName).toBe('Story3');
    expect(stories['2'].parameters).toMatchInlineSnapshot(`
      Object {
        "docs": Object {
          "source": Object {
            "code": "xyz",
          },
        },
      }
    `);
  });
});
