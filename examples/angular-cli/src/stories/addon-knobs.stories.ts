import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  radios,
  color,
  date,
  button,
} from '@storybook/addon-knobs';

import { SimpleKnobsComponent } from './knobs.component';
import { AllKnobsComponent } from './all-knobs.component';

storiesOf('Addon|Knobs', module)
  .addParameters({
    knobs: {
      disableDebounce: true,
    },
  })
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name: string = text('name', 'John Doe');
    const age: number = number('age', 0);
    const phoneNumber: string = text('phoneNumber', '555-55-55');

    return {
      moduleMetadata: {
        entryComponents: [SimpleKnobsComponent],
        declarations: [SimpleKnobsComponent],
      },
      template: `
        <h1> This is a template </h1>
        <storybook-simple-knobs-component
          [age]="age"
          [phoneNumber]="phoneNumber"
          [name]="name"
        >
        </storybook-simple-knobs-component>
      `,
      props: {
        name,
        age,
        phoneNumber,
      },
    };
  })
  .add('All knobs', () => {
    const name: string = text('name', 'Jane');
    const stock: number = number('stock', 20, {
      range: true,
      min: 0,
      max: 30,
      step: 5,
    });
    const fruits: any = {
      Apple: 'apples',
      Banana: 'bananas',
      Cherry: 'cherries',
    };
    const fruit: any = select('fruit', fruits, 'apples');
    const otherFruits: any = {
      Kiwi: 'kiwi',
      Guava: 'guava',
      Watermelon: 'watermelon',
    };
    const otherFruit: any = radios('Other Fruit', otherFruits, 'watermelon');
    const price: number = number('price', 2.25);

    const border: any = color('border', 'deeppink');
    const today: any = date('today', new Date('Jan 20 2017'));
    const items: any = array('items', ['Laptop', 'Book', 'Whiskey']);
    const nice: boolean = boolean('nice', true);
    button('Arbitrary action', action('You clicked it!'));

    return {
      component: AllKnobsComponent,
      props: {
        name,
        stock,
        fruit,
        otherFruit,
        price,
        border,
        today,
        items,
        nice,
      },
    };
  })
  .add('XSS safety', () => ({
    template: text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >'),
  }));
