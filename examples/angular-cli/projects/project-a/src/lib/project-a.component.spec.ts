import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAComponent } from './project-a.component';

describe('ProjectAComponent', () => {
  let component: ProjectAComponent;
  let fixture: ComponentFixture<ProjectAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
