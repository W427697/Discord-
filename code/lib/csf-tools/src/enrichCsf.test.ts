/// <reference types="@types/jest" />;
/* eslint-disable no-underscore-dangle */

import { dedent } from 'ts-dedent';
import { loadCsf } from './CsfFile';
import { enrichCsf, extractSource } from './enrichCsf';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
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
        const Template = (args) => <Button {...args} />
        export const Basic = Template.bind({});
      `)
    ).toMatchInlineSnapshot(`Template.bind({})`);
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

describe('enrichCsf', () => {
  describe('source', () => {
    it('csf1', () => {
      expect(
        enrichCsf(dedent`
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
        enrichCsf(dedent`
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
        enrichCsf(dedent`
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
        enrichCsf(dedent`
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
});
