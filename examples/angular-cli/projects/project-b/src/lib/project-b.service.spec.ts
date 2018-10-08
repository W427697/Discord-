import { TestBed } from '@angular/core/testing';

import { ProjectBService } from './project-b.service';

describe('ProjectBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectBService = TestBed.get(ProjectBService);
    expect(service).toBeTruthy();
  });
});
