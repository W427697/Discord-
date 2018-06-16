import { TestBed, inject } from '@angular/core/testing';

import { TestLibService } from './test-lib.service';

describe('TestLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestLibService],
    });
  });

  it('should be created', inject([TestLibService], (service: TestLibService) => {
    expect(service).toBeTruthy();
  }));
});
