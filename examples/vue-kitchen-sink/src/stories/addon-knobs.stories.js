import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button,
} from '@storybook/addon-knobs';

const logger = console;

storiesOf('Addon|Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => ({
    props: {
      name: {
        type: String,
        default: text('Name', 'John Doe'),
      },
    },

    template: `<div @click="age++">I am {{ name }} and I'm {{ age }} years old.</div>`,

    data() {
      return { age: 40 };
    },

    created() {
      logger.log('created');
    },
    destroyed() {
      logger.log('destroyed');
    },
  }))
  .add('All knobs', () => {
    button('Arbitrary action', action('You clicked it!'));

    return {
      props: {
        name: {
          type: String,
          default: text('Name', 'Jane'),
        },
        stock: {
          type: Number,
          default: number('Stock', 20, {
            range: true,
            min: 0,
            max: 30,
            step: 5,
          }),
        },
        fruit: {
          type: String,
          default: select(
            'Fruit',
            {
              Apple: 'apples',
              Banana: 'bananas',
              Cherry: 'cherries',
            },
            'apples'
          ),
        },
        price: {
          type: Number,
          default: number('Price', 2.25),
        },
        colour: {
          type: String,
          default: color('Border', 'deeppink'),
        },
        today: {
          type: Number,
          default: date('Today', new Date('Jan 20 2017 GMT+0')),
        },
        dateOptions: {
          type: Object,
          default() {
            return {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            };
          },
        },
        items: {
          type: Array,
          default() {
            return array('Items', ['Laptop', 'Book', 'Whiskey']);
          },
        },
        nice: {
          type: Boolean,
          default: boolean('Nice', true),
        },
      },
      computed: {
        dateString() {
          const { today, dateOptions } = this;

          return new Date(today).toLocaleDateString('en-US', dateOptions);
        },
      },
      template: `
          <div
            :style="{
              border: '2px dotted',
              borderColor: colour,
              padding: '8px 22px',
              borderRadius: '8px'
            }"
          >
            <h1>My name is {{name}},</h1>
            <h3>today is {{dateString}}</h3>
            <p v-if="stock">
              I have a stock of {{stock}} {{fruit}}, costing &dollar;{{price}} each.
            </p>
            <p v-else>
              I'm out of {{fruit}}
              <span v-if="nice">, Sorry!</span>
              <span v-else>.</span>
            </p>
            <p>Also, I have:</p>
            <ul>
              <li v-for="item in items" :key="item">
                {{ item }}
              </li>
            </ul>
            <p v-if="nice">Nice to meet you!</p>
            <p v-else>Leave me alone!</p>
          </div>
        `,
    };
  })
  .add('XSS safety', () => ({
    template: `
      <div>
        ${text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >')}
      </div>
    `,
  }));
