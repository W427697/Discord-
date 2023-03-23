// test.module.ts
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CHIP_COLOR } from './chip-color.token';

@NgModule()
export class SingletonService {
  constructor(@Optional() @SkipSelf() parentModule?: SingletonService) {
    if (parentModule) {
      throw new Error('SingletonService is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<SingletonService> {
    return {
      ngModule: SingletonService,
      providers: [
        {
          provide: CHIP_COLOR,
          useValue: 'green',
        },
      ],
    };
  }
}
