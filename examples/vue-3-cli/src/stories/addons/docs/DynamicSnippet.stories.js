import { h } from 'vue';

import MyButton from '../../Button.vue';
import ComplexButton from './ComplexButton.vue';
import TodoList from './TodoList.vue';

export default {
  title: 'Addons/Docs/Dynamic Snippet Rendering',
  component: MyButton,
  argTypes: {
    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    onClick: {},
  },
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { MyButton },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<my-button v-bind="args" v-show="true" />',
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Nested = (args) => ({
  components: { MyButton },
  setup() {
    return { args };
  },
  template: `
    <div data-some-attr="" data-boolean>
      <p data-another-attr="has-value" aria-hidden="true">Invisibo</p>
      <my-button v-bind="args" primary />
    </div>
  `,
});
Nested.args = {
  label: 'Nested',
};

export const NamedSlot = (args) => ({
  components: { ComplexButton },
  methods: {
    get5() {
      return 5;
    },
  },
  computed: {
    qux() {
      return false;
    },
    // Should not be appeared.
    null() {
      return 3;
    },
  },
  setup() {
    return { args };
  },
  template: `
    <ComplexButton foo="bar" :baz="3 + get5()" :qux="qux" :quux="null">
      <template v-slot:icon>
        <span>i</span>
      </template>
      Button
    </ComplexButton>
  `,
});

export const RenderFunction = (args) => ({
  render() {
    return h(MyButton, {
      label: args.label,
      primary: args.primary,
    });
  },
});
RenderFunction.args = {
  label: 'RenderFunction Button',
  primary: true,
};

export const ScopedSlot = (args) => ({
  components: { TodoList },
  template: `
    <TodoList>
      <template v-slot:default="{ item }">
        <span>{{ item }}</span>
      </template>
    </TodoList>
  `,
});

// https://v3.vuejs.org/guide/render-function.html#slots
export const ScopedSlotRenderFunction = (args) => ({
  render() {
    return h(TodoList, null, {
      default: (props) => h('span', props.item),
    });
  },
});
ScopedSlotRenderFunction.storyName = 'Scoped Slot (render function)';
