import type { StoryObj, Meta } from '@storybook/vue3';
// import ComponentJSetup from './reference-type-props/component-js-setup.vue';
// import ComponentJS from './reference-type-props/component-js.vue';
import Component from './reference-type-props/component.vue';

const meta = {
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof meta>;
export default meta;
enum MyEnum {
  Small,
  Medium,
  Large,
}

export const ReferenceTypeProps: Story = {
  args: {
    foo: 'Foo',
    baz: ['Baz', 'Bar', 'Foo'],
    bar: 1,
    unionOptional: 'Foo',
    union: 'Foo',
    unionRequiredWithDefault: 'Foo',
    inlined: { foo: 'Foo' },
    nested: { nestedProp: 'Nested Prop' },
    nestedIntersection: { nestedProp: 'Nested Prop', additionalProp: 'Additional Prop' },
    array: [{ foo: 'Foo' }],
    literalFromContext: ['Uncategorized', 'Display', 'Addons'],
    enumValue: MyEnum.Small,
    recursive: { recursive: { recursive: 'recursive' } },
  },
};
