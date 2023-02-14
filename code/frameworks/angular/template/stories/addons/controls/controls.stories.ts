import { Args } from '@storybook/angular';
import ControlsComponent from './controls.component';

export default {
  component: ControlsComponent,
};
export const AllControls = (props: Args) => ({ props });
AllControls.args = { text: 'foobar' };
export const OnlyInputsCategory = (props: Args) => ({ props });
OnlyInputsCategory.parameters = { controls: { visibleCategories: ['inputs'] } };
OnlyInputsCategory.args = { text: 'foobar' };
