import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

export class TestTsClass {
  testStringVar: string;

  testNumberVar: number;

  testBooleanVar: boolean;

  testStringArrayVar: string[];

  testAnyVar: any;
}

storiesOf('Addon|Actions', module)
  .add('Action only', () => ({
    component: Button,
    props: {
      text: 'Action only',
      onClick: action('log 1'),
    },
  }))
  .add('Action and method', () => ({
    component: Button,
    props: {
      text: 'Action and Method',
      onClick: (e: any) => {
        console.log(e);
        e.preventDefault();
        action('log2')(e.target);
      },
    },
  }));
