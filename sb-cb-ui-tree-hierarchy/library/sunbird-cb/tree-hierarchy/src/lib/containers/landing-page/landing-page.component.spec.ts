import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { FrameworkService } from '../../services/framework.service';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;
  const categories = [{ code: 'board', name: 'Board' }, { code: 'medium', name: 'Medium' }];

  beforeEach(waitForAsync(() => {
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['getFrameworkInfo']);
    frameworkServiceSpy.getFrameworkInfo.and.returnValue(of({ result: { framework: { categories } } }));
    TestBed.configureTestingModule({
      declarations: [ LandingPageComponent ],
      providers: [
        { provide: FrameworkService, useValue: frameworkServiceSpy },
      ],
      // lib-create-categories is rendered as a child; its behaviour is covered by its own spec
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the framework categories on init', () => {
    expect(frameworkServiceSpy.getFrameworkInfo).toHaveBeenCalled();
    expect(component.frameworkCategories).toEqual(categories);
  });
});
