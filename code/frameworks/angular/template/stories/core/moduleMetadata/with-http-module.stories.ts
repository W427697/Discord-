import { Meta, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenCloseComponent } from './angular-src/open-close-component/open-close.component';
import { HttpClientModule } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) { }
}

export default {
  component: OpenCloseComponent,
} as Meta;

export const WithBrowserAnimations: StoryFn = () => ({
  template: `<app-open-close></app-open-close>`,
  moduleMetadata: {
    declarations: [OpenCloseComponent],
    imports: [BrowserAnimationsModule, HttpClientModule],
    providers: [HttpService]
  },
});