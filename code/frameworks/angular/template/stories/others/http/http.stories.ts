import { Meta, StoryFn } from '@storybook/angular';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './src/in-memory-data.service';

import { RequestCache, RequestCacheWithMap } from './src/request-cache.service';

import { AppComponent } from './src/app.component';
import { AuthService } from './src/auth.service';
import { ConfigComponent } from './src/config/config.component';
import { DownloaderComponent } from './src/downloader/downloader.component';
import { HeroesComponent } from './src/heroes/heroes.component';
import { HttpErrorHandler } from './src/http-error-handler.service';
import { MessageService } from './src/message.service';
import { MessagesComponent } from './src/messages/messages.component';
import { PackageSearchComponent } from './src/package-search/package-search.component';
import { UploaderComponent } from './src/uploader/uploader.component';

import { httpInterceptorProviders } from './src/http-interceptors/index';

export default {
  component: AppComponent,
} as Meta;

export const WithBrowserAnimations: StoryFn = () => ({
  template: `<app-root></app-root>`,
  moduleMetadata: {
    imports: [
      FormsModule,
      HttpClientModule,
      HttpClientXsrfModule.withOptions({
        cookieName: 'My-Xsrf-Cookie',
        headerName: 'My-Xsrf-Header',
      }),

      // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
      // and returns simulated server responses.
      // Remove it when a real server is ready to receive requests.
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
        passThruUnknownUrl: true,
        put204: false, // return entity after PUT/update
      }),
    ],
    declarations: [
      AppComponent,
      ConfigComponent,
      DownloaderComponent,
      HeroesComponent,
      MessagesComponent,
      UploaderComponent,
      PackageSearchComponent,
    ],
    providers: [
      AuthService,
      HttpErrorHandler,
      MessageService,
      { provide: RequestCache, useClass: RequestCacheWithMap },
      httpInterceptorProviders,
    ],
  },
});
