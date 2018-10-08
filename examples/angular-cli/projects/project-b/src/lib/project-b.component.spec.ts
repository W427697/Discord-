import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBComponent } from './project-b.component';

describe('ProjectBComponent', () => {
  let component: ProjectBComponent;
  let fixture: ComponentFixture<ProjectBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectBComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
