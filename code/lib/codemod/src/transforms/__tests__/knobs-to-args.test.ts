/// <reference types="@types/jest" />;

import { describe } from '@jest/globals';
import { dedent } from 'ts-dedent';
import _transform from '../knobs-to-args';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
});

//

const jsTransform = (source: string) => _transform({ source }, null, {}).trim();

describe('knobs-to-args', () => {
  describe('decorators', () => {
    it('should strip one decorator', () => {
      expect(
        jsTransform(dedent`
        import { withKnobs } from '@storybook/addon-knobs';
        export default {
          decorators: [withKnobs],
        };
        export const A = () => <Cat />;
      `)
      ).toMatchInlineSnapshot(`
        export default {
        };
        export const A = () => <Cat />;
      `);
    });

    it('should strip multiple decorators', () => {
      expect(
        jsTransform(dedent`
        import { withWhatever } from 'somewhere';
        import { withKnobs } from '@storybook/addon-knobs';
        export default {
          decorators: [withKnobs, withWhatever],
        };
        export const A = () => <Cat />;
      `)
      ).toMatchInlineSnapshot(`
        import { withWhatever } from 'somewhere';
        export default {
          decorators: [withWhatever],
        };
        export const A = () => <Cat />;
      `);
    });
  });
  describe('javascript', () => {
    it('text in JS', () => {
      expect(
        jsTransform(dedent`
        import { text } from '@storybook/addon-knobs';
        export default { title: 'Cat' };
        export const Story = () => {
          const name = text('Name', 'James');
          return <Cat name={name} />;
        };
      `)
      ).toMatchInlineSnapshot(`
        export default { title: 'Cat' };
        export const Story = ({ name }) => {
          return <Cat name={name} />;
        };
      `);
    });

    it('text in JSX', () => {
      expect(
        jsTransform(dedent`
        import { text } from '@storybook/addon-knobs';
        export default { title: 'Cat' };
        export const Story = () => {
          return <Cat name={text('Name', 'James')} />;
        };
      `)
      ).toMatchInlineSnapshot(`
        export default { title: 'Cat' };
        export const Story = ({ name }) => {
          return <Cat name={name} />;
        };
        Story.args = {
          name: 'James'
        };
      `);
    });
  });
});
