import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-simple-knobs-component',
  template: `
    <div>I am {{ name }} and I'm {{ age }} years old.</div>
    <div>Phone Number: {{ phoneNumber }}</div>
  `,
})
export class SimpleKnobsComponent {
  @Input()
  name: string;

  @Input()
  age: number;

  @Input()
  phoneNumber: string;
}
