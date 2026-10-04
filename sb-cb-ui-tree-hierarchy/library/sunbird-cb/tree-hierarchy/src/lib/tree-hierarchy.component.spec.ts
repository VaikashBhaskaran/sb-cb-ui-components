import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TreeHierarchyComponent } from './tree-hierarchy.component';
import { FrameworkService } from './services/framework.service';

describe('TreeHierarchyComponent', () => {
  let component: TreeHierarchyComponent;
  let fixture: ComponentFixture<TreeHierarchyComponent>;
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;

  beforeEach(async () => {
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['updateEnvironment', 'setConfig']);
    await TestBed.configureTestingModule({
      declarations: [TreeHierarchyComponent],
      providers: [{ provide: FrameworkService, useValue: frameworkServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeHierarchyComponent);
    component = fixture.componentInstance;
    component.environment = { frameworkName: 'fw' };
    component.taxonomyConfig = [{ frameworkId: 'fw', config: [] }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should push environment and taxonomy config to the framework service on init', () => {
    expect(frameworkServiceSpy.updateEnvironment).toHaveBeenCalledWith({ frameworkName: 'fw' });
    expect(frameworkServiceSpy.setConfig).toHaveBeenCalledWith([{ frameworkId: 'fw', config: [] }]);
  });
});
