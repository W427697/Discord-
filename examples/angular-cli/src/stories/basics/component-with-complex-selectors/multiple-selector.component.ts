import {Component, Input} from '@angular/core';

@Component({
  selector: 'storybook-multiple-selector, storybook-multiple-selector2',
  template: `<h3>Multiple selector - {{label}}</h3>
    Selector: "storybook-multiple-selector, storybook-multiple-selector2" <br />
    Generated template: "&lt;storybook-multiple-selector>&lt;/storybook-multiple-selector>" `,
})
export class MultipleSelectorComponent {
  @Input()
  label: string;
}
