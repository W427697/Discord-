import { getStorySortParameter } from './getStorySortParameter';

describe('getStorySortParameter', () => {
  describe('supported', () => {
    it('no parameters', () => {
      expect(getStorySortParameter({ decorators: [] } as any)).toBeUndefined();
    });

    it('no storySort parameter', () => {
      expect(
        getStorySortParameter({
          parameters: {
            layout: 'fullscreen',
          },
        } as any)
      ).toBeUndefined();
    });

    it('with wildcards', () => {
      expect(
        getStorySortParameter({
          parameters: {
            options: {
              storySort: [
                //
                'Intro',
                'Pages',
                ['Home', 'Login', 'Admin'],
                'Components',
                '*',
                'WIP',
              ],
            },
          },
        } as any)
      ).toMatchInlineSnapshot(`
        Array [
          "Intro",
          "Pages",
          Array [
            "Home",
            "Login",
            "Admin",
          ],
          "Components",
          "*",
          "WIP",
        ]
      `);
    });

    it('arrow function', () => {
      expect(
        getStorySortParameter({
          parameters: {
            options: {
              storySort: (a: any, b: any) =>
                a[1].kind === b[1].kind
                  ? 0
                  : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
            },
          },
        })
      ).toMatchInlineSnapshot(`[Function]`);
    });

    it('function', () => {
      expect(
        getStorySortParameter({
          parameters: {
            options: {
              storySort: function sortStories(a: any, b: any) {
                return a[1].kind === b[1].kind
                  ? 0
                  : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`[Function]`);
    });

    it('empty sort', () => {
      expect(
        getStorySortParameter({
          parameters: {
            options: {
              storySort: {
                method: '' as any,
                order: [],
                locales: '',
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "locales": "",
          "method": "",
          "order": Array [],
        }
      `);
    });

    it('parameters typescript', () => {
      expect(
        getStorySortParameter({
          parameters: {
            options: {
              storySort: {
                method: '' as any,
                order: [],
                locales: '',
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "locales": "",
          "method": "",
          "order": Array [],
        }
      `);
    });
    it('invalid parameters', () => {
      expect(() => getStorySortParameter({ parameters: [] as any }))
        .toThrowErrorMatchingInlineSnapshot(`
        "Unexpected 'parameters'. Parameter 'options.storySort' should be defined inline e.g.:

        export const parameters = {
          options: {
            storySort: <array | object | function>
          }
        }"
      `);
    });
  });
});
