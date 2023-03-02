import { expectTypeOf } from 'expect-type';

import { reactive } from 'vue';
import { updateArgs } from './render';

describe('Render Story', () => {
  test('update reactive Args updateArgs()', () => {
    const reactiveArgs = reactive({ argFoo: 'foo', argBar: 'bar' }); // get reference to reactiveArgs or create a new one;
    expectTypeOf(reactiveArgs).toMatchTypeOf<Record<string, any>>();
    expectTypeOf(reactiveArgs).toEqualTypeOf<{ argFoo: string; argBar: string }>();

    const newArgs = { argFoo: 'foo2', argBar: 'bar2' };
    updateArgs(reactiveArgs, newArgs);
    expectTypeOf(reactiveArgs).toEqualTypeOf<{ argFoo: string; argBar: string }>();
    expect(reactiveArgs).toEqual(newArgs);
  });

  test('update reactive Args component new arg updateArgs()', () => {
    const reactiveArgs = reactive({ objectArg: { argFoo: 'foo', argBar: 'bar' } }); // get reference to reactiveArgs or create a new one;
    expectTypeOf(reactiveArgs).toMatchTypeOf<Record<string, any>>();
    expectTypeOf(reactiveArgs).toEqualTypeOf<{ objectArg: { argFoo: string; argBar: string } }>();

    const newArgs = { argFoo: 'foo2', argBar: 'bar2' };
    updateArgs(reactiveArgs, newArgs);
    expectTypeOf(reactiveArgs).toEqualTypeOf<{ objectArg: { argFoo: string; argBar: string } }>();
    expect(reactiveArgs).toEqual({ objectArg: newArgs });
  });

  test('update reactive Args component 2 args updateArgs()', () => {
    const reactiveArgs = reactive({
      objectArg: { argFoo: 'foo' },
      objectArg2: { argBar: 'bar' },
    }); // get reference to reactiveArgs or create a new one;
    expectTypeOf(reactiveArgs).toMatchTypeOf<Record<string, any>>();
    expectTypeOf(reactiveArgs).toEqualTypeOf<{
      objectArg: { argFoo: string };
      objectArg2: { argBar: string };
    }>();

    const newArgs = { argFoo: 'foo2', argBar: 'bar2' };
    updateArgs(reactiveArgs, newArgs);
    expectTypeOf(reactiveArgs).toEqualTypeOf<{
      objectArg: { argFoo: string };
      objectArg2: { argBar: string };
    }>();
    expect(reactiveArgs).toEqual({
      objectArg: { argFoo: newArgs.argFoo },
      objectArg2: { argBar: newArgs.argBar },
    });
  });
});
