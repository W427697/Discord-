import {MultipleSelectorComponent} from './multiple-selector.component';
import {AttributeSelectorComponent} from './attribute-selector.component';
import {ClassSelectorComponent} from './class-selector.component';
import {AllSelectorsComponent} from './all-selectors.component';
import {Story} from '@storybook/angular';

export default {
  title: 'Basics / Component / With Complex Selectors',
};

export const MultipleSelectors: Story = (args) => ({
  props: args,
  template: '<storybook-multiple-selector random [label]="label"></storybook-multiple-selector>'
});

MultipleSelectors.storyName = 'multiple selectors';
MultipleSelectors.parameters = {
  component: MultipleSelectorComponent
};
MultipleSelectors.args = {
  label: 'foo'
}

export const AttributeSelectors = () => ({});

AttributeSelectors.storyName = 'attribute selectors';
AttributeSelectors.parameters = {
  component: AttributeSelectorComponent,
};

export const ClassSelectors = () => ({});

ClassSelectors.storyName = 'class selectors';
ClassSelectors.parameters = {
  component: ClassSelectorComponent,
};

export const AllSelectors = () => ({});

AllSelectors.storyName = 'all selectors';
AllSelectors.parameters = {
  component: AllSelectorsComponent
};
AllSelectors.args = {
  label: 'foo'
}

