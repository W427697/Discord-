import { TestBed, inject } from '@angular/core/testing';

import { ProjectAService } from './project-a.service';

describe('ProjectAService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectAService],
    });
  });

  it('should be created', inject([ProjectAService], (service: ProjectAService) => {
    expect(service).toBeTruthy();
  }));
});
