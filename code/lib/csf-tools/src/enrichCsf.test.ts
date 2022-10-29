/// <reference types="@types/jest" />;
/* eslint-disable no-underscore-dangle */

import { dedent } from 'ts-dedent';
import { loadCsf, formatCsf } from './CsfFile';
import { enrichCsf, extractSource } from './enrichCsf';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
});

const enrich = (code: string) => {
  // we don't actually care about the title

  const csf = loadCsf(code, { makeTitle: (userTitle) => userTitle || 'default' }).parse();
  enrichCsf(csf);
  return formatCsf(csf);
};

describe('enrichCsf', () => {
  describe('source', () => {
    it('csf1', () => {
      expect(
        enrich(dedent`
          export default {
           title: 'Button',
          }
          export const Basic = () => <Button />
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        export const Basic = () => <Button />;
        Basic.parameters = {
          storySource: {
            source: "() => <Button />"
          },
          ...Basic.parameters
        };
      `);
    });
    it('csf2', () => {
      expect(
        enrich(dedent`
          export default {
            title: 'Button',
          }
          const Template = (args) => <Button {...args} />
          export const Basic = Template.bind({});
          Basic.parameters = { foo: 'bar' }
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        const Template = args => <Button {...args} />;
        export const Basic = Template.bind({});
        Basic.parameters = {
          foo: 'bar'
        };
        Basic.parameters = {
          storySource: {
            source: "args => <Button {...args} />"
          },
          ...Basic.parameters
        };
      `);
    });
    it('csf3', () => {
      expect(
        enrich(dedent`
          export default {
            title: 'Button',
          }
          export const Basic = {
            parameters: { foo: 'bar' }
          }
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        export const Basic = {
          parameters: {
            foo: 'bar'
          }
        };
        Basic.parameters = {
          storySource: {
            source: "{\\n  parameters: {\\n    foo: 'bar'\\n  }\\n}"
          },
          ...Basic.parameters
        };
      `);
    });
    it('multiple stories', () => {
      expect(
        enrich(dedent`
          export default {
            title: 'Button',
          }
          export const A = {}
          export const B = {}
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        export const A = {};
        export const B = {};
        A.parameters = {
          storySource: {
            source: "{}"
          },
          ...A.parameters
        };
        B.parameters = {
          storySource: {
            source: "{}"
          },
          ...B.parameters
        };
      `);
    });
  });

  describe('descriptions', () => {
    it('skips inline comments', () => {
      expect(
        enrich(dedent`
          export default {
           title: 'Button',
          }
          // The most basic button
          export const Basic = () => <Button />
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        // The most basic button
        export const Basic = () => <Button />;
        Basic.parameters = {
          storySource: {
            source: "() => <Button />"
          },
          ...Basic.parameters
        };
      `);
    });

    it('skips blocks without jsdoc', () => {
      expect(
        enrich(dedent`
          export default {
           title: 'Button',
          }
          /* The most basic button */
          export const Basic = () => <Button />
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        /* The most basic button */
        export const Basic = () => <Button />;
        Basic.parameters = {
          storySource: {
            source: "() => <Button />"
          },
          ...Basic.parameters
        };
      `);
    });

    it('JSDoc single-line', () => {
      expect(
        enrich(dedent`
          export default {
           title: 'Button',
          }
          /** The most basic button */
          export const Basic = () => <Button />
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        /** The most basic button */
        export const Basic = () => <Button />;
        Basic.parameters = {
          storySource: {
            source: "() => <Button />"
          },
          docs: {
            description: {
              story: "The most basic button"
            }
          },
          ...Basic.parameters
        };
      `);
    });

    it('JSDoc multi-line', () => {
      expect(
        enrich(dedent`
          export default {
           title: 'Button',
          }
          /**
           * The most basic button
           * 
           * In a block!
           */
          export const Basic = () => <Button />
        `)
      ).toMatchInlineSnapshot(`
        export default {
          title: 'Button'
        };
        /**
         * The most basic button
         * 
         * In a block!
         */
        export const Basic = () => <Button />;
        Basic.parameters = {
          storySource: {
            source: "() => <Button />"
          },
          docs: {
            description: {
              story: "The most basic button\\n\\nIn a block!"
            }
          },
          ...Basic.parameters
        };
      `);
    });
  });
});

const source = (csfExport: string) => {
  const code = dedent`
    export default { title: 'Button' }
    ${csfExport}
  `;
  const csf = loadCsf(code, { makeTitle: (userTitle) => userTitle }).parse();
  const exportNode = Object.values(csf._storyExports)[0];
  return extractSource(exportNode);
};

describe('extractSource', () => {
  it('csf1', () => {
    expect(
      source(dedent`
        export const Basic = () => <Button />
      `)
    ).toMatchInlineSnapshot(`() => <Button />`);
  });
  it('csf2', () => {
    expect(
      source(dedent`
        export const Basic =  (args) => <Button {...args} />;
      `)
    ).toMatchInlineSnapshot(`args => <Button {...args} />`);
  });
  it('csf3', () => {
    expect(
      source(dedent`
        export const Basic = {
          parameters: { foo: 'bar' }
        }
      `)
    ).toMatchInlineSnapshot(`
      {
        parameters: {
          foo: 'bar'
        }
      }
    `);
  });
});
