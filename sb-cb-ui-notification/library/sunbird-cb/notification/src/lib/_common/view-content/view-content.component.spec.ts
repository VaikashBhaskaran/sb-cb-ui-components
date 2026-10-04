import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ViewContentComponent } from './view-content.component';
import { LibNotificationsService } from '../../_services/lib-notifications.service';

describe('ViewContentComponent', () => {
  let component: ViewContentComponent;
  let fixture: ComponentFixture<ViewContentComponent>;
  let libNotificationsService: jasmine.SpyObj<LibNotificationsService>;

  beforeEach(() => {
    libNotificationsService = jasmine.createSpyObj<LibNotificationsService>('LibNotificationsService', ['searchContent']);
    libNotificationsService.searchContent.and.returnValue(of({ result: { content: [{ identifier: 'do_1' }] } }));
    TestBed.configureTestingModule({
      declarations: [ViewContentComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: LibNotificationsService, useValue: libNotificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ViewContentComponent);
    component = fixture.componentInstance;
    component.notification = { message: { data: { id: 'do_1' } } };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should search for the content referenced by the notification', () => {
    fixture.detectChanges();
    const request: any = libNotificationsService.searchContent.calls.mostRecent().args[0];
    expect(request.request.filters.identifier).toBe('do_1');
    expect(component.contents).toEqual([{ identifier: 'do_1' }]);
    expect(component.skeletonLoader).toBe(false);
  });

  it('should stop the loader when the search fails', () => {
    spyOn(console, 'error');
    libNotificationsService.searchContent.and.returnValue(throwError('failed'));
    fixture.detectChanges();
    expect(component.contents).toEqual([]);
    expect(component.skeletonLoader).toBe(false);
  });
});
