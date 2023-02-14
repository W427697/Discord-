import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'storybook-controls-component',
  template: `{{ text }}`,
})
export default class ControlsComponent implements OnInit {
  @Input()
  text = '';

  @Output()
  onClick = new EventEmitter<any>();

  private internalState = 0;

  ngOnInit() {
    this.internalState = 42;
  }
}
