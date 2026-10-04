import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ConfigFrameworkComponent } from './config-framework.component';
import { FrameworkService } from '../../services/framework.service';

describe('ConfigFrameworkComponent', () => {
  let component: ConfigFrameworkComponent;
  let fixture: ComponentFixture<ConfigFrameworkComponent>;
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;
  const categories = [{ code: 'dept', name: 'Department' }];

  beforeEach(waitForAsync(() => {
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['getFrameworkInfo']);
    frameworkServiceSpy.getFrameworkInfo.and.returnValue(of({ result: { framework: { categories } } }));
    TestBed.configureTestingModule({
      declarations: [ ConfigFrameworkComponent ],
      providers: [{ provide: FrameworkService, useValue: frameworkServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load framework categories on init', () => {
    expect(frameworkServiceSpy.getFrameworkInfo).toHaveBeenCalled();
    expect(component.frameworkCategories).toEqual(categories);
  });

  it('updateCategory should add a category representation linked to the previous one', () => {
    component.updateCategory('A');
    component.updateCategory('B');
    expect(component.categoriesRepresentations.length).toBe(2);
    expect(component.categoriesRepresentations[0].terms[1].parent).toBe('');
    expect(component.categoriesRepresentations[1].terms[0].parent).toBe(component.categoriesRepresentations[0].terms[1].domId);
  });

  it('removeCategory should remove the category and rebuild the rest', () => {
    component.updateCategory('A');
    component.updateCategory('B');
    component.updateCategory('C');
    component.removeCategory(1);
    expect(component.categoriesRepresentations.map(c => c.name)).toEqual(['A', 'C']);
  });

  it('changePosition should swap categories', () => {
    component.updateCategory('A');
    component.updateCategory('B');
    component.changePosition({ prev: 0, cur: 1 });
    expect(component.categoriesRepresentations.map(c => c.name)).toEqual(['B', 'A']);
  });
});
