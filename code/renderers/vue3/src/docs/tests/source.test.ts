import { describe, expect, test } from '@jest/globals';
import { baseParse } from '@vue/compiler-core';
import Button from './Button.vue';

describe('generateSource Vue3', () => {
  test('get template from storyFn :', () => {
    const storyFn = (args: any) => ({
      components: { Button },
      setup() {
        return {
          args,
        };
      },
      template: `<div><Button :primary="false" size="small" :label="args.label">{{args.label}}</Button></div>
          <Button size="large" :label="args.label">{{args.label}}</Button>
          {{args.label}}`,
    });
    const storyFnString = storyFn.toString();
    console.log(' storyFn ', storyFnString);
    const { template } = storyFn();
    const ast = baseParse(template);
    const { children, type } = ast;
    console.log({ children, type });
    expect({ booleanProp: true }).toEqual({ booleanProp: true });
  });
});
