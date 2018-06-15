import { storiesOf } from '@storybook/angular';
import { TestLibComponent } from './test-lib.component';

storiesOf('Projects|TestLib', module)
  .addDecorator('test-lib.component')
  .add('TestLib', () => ({
    component: TestLibComponent,
  }));
