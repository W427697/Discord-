import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'storybook-test-lib',
  template: `
    <p>
      test-lib works!
    </p>
  `,
  styles: [],
})
export class TestLibComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
