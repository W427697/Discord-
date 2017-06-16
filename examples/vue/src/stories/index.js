import Vue from 'vue';
import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { withNotes } from '@storybook/addon-notes';

import MyButton from './Button.vue';


storiesOf('Button', module)
  // Works if Vue.component is called in the config.js in .storybook 
  .add('story as a function template', () => '<my-button :rounded="true">story as a function template</my-button>')
  .add('story as a function renderer', () => (h) => h('div', ['story as a function renderer']))
  .add('story as a function component with template', () => ({
    template: '<my-button :rounded="true">story as a function component with template</my-button>',
  }))
  .add('story as a function component with renderer', () => ({
    render: (h) => h('my-button', { props : { rounded: true }}, ['story as a function component with renderer']),
  }))
  .add('with vuex', () => ({
    components: { MyButton },
    template: '<my-button :handle-click="log">with vuex: {{ $store.state.count }}</my-button>',
    store: new Vuex.Store({
      state: { count: 0 },
      mutations: {
        increment(state) {
          state.count++;
          action()
        }
      }
    }),
    methods: {
      log() {
        this.$store.commit('increment');
      },
    },
  }))
  .add('with text', () => ({
    // need to register local component until we can make sur Vue.componennt si called before mounting the root Vue
    components: { MyButton },
    template: '<my-button :handle-click="log">with text: {{ count }}</my-button>',
    data: () => ({
      count: 10,
    }),
    methods: {
      action: action('I love vue'),
      log() {
        this.count++;
        this.action(this.count);
      }
    }
  }));

storiesOf('Other', module)
  .add('button with emoji', () => '<button>😑😐😶🙄</button>')
  .add('p with emoji', () => '<p>🤔😳😯😮</p>')
  .add('colorful', () => ({
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['colorful']);
    }
  }))
  .add('rounded', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }))
  .add('not rounded', () => ({
    components: { MyButton },
    template: '<my-button :rounded="false" :handle-click="action">not rounded</my-button>',
    methods: {
      action: linkTo('Button')
    }
  }))


storiesOf('Addon Notes', module)
  .add('with some emoji', () => {
    withNotes('My notes on emojies');
    return '<p>🤔😳😯😮</p>'
  })
  .add('with some button', () => {
    withNotes('My notes on some button');

    return {
      components: { MyButton },
      template: '<my-button :rounded="true">rounded</my-button>'
    }
  })
  .add('with some color', () => {
    withNotes('Some notes on some colored component')

    return {
      render(h) {
        return h(MyButton, { props: { color: 'pink' } }, ['colorful']);
      }
    }
  })
  .add('with some text', () => {
    withNotes('My notes on some text')
    return {
      template: '<div>Text</div>'
    };
  })
  .add('with some long text', () => {
    withNotes('My notes on some long text')
    return {
      template: '<div>A looooooooonnnnnnnggggggggggggg text</div>'
    };
  })
  .add('with a button and clickable update', () => {
    withNotes('My notes on a button and clickable update')
    return {
      methods: {
        onClick() {
          withNotes('My new notes');
        }
      },
      template: '<button @click="onClick">Text</button>'
    };
  })
  .add('with some bold text', () => {
    withNotes('My notes on some bold text');
    return {
      render: h => h('div', [h('strong', ['A very long text to display'])])
    }
  });