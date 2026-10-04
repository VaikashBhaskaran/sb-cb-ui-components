import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LibNotificationsService } from './lib-notifications.service';

describe('LibNotificationsService', () => {
  let service: LibNotificationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LibNotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all notifications without a sub_type filter', () => {
    service.getNotifications(0, 10, 'all').subscribe();
    const req = httpMock.expectOne('apis/proxies/v8/v1/notifications/list?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ result: { notifications: [] } });
  });

  it('should fetch notifications filtered by sub_type', () => {
    service.getNotifications(1, 5, 'MANDATORY').subscribe();
    const req = httpMock.expectOne('apis/proxies/v8/v1/notifications/list?page=1&size=5&sub_type=MANDATORY');
    expect(req.request.method).toBe('GET');
    req.flush({ result: { notifications: [] } });
  });

  it('should strip rich text and truncate the quoted post of profanity check notifications', () => {
    let result: any;
    service.getNotifications(0, 10, 'all').subscribe(res => result = res);
    httpMock.expectOne('apis/proxies/v8/v1/notifications/list?page=0&size=10').flush({
      result: {
        notifications: [
          { sub_category: 'PROFANITY_CHECK', message: { body: 'Your post "<b>this is a very long post that goes past the limit</b>" was flagged' } },
          { sub_category: 'OTHER', message: { body: '<b>untouched</b>' } },
        ],
      },
    });
    expect(result.result.notifications[0].message.body)
      .toBe('Your post "this is a very long post that..." was flagged');
    expect(result.result.notifications[1].message.body).toBe('<b>untouched</b>');
  });

  it('should strip rich text from messages without a quoted part', () => {
    expect(service.formatNotificationMessage('<p>hello <i>there</i></p>')).toBe('hello there');
  });

  it('should patch mark as read and mandatory read endpoints', () => {
    service.markAsRead({ request: {} }).subscribe();
    service.markMandatoryAsRead({ request: {} }).subscribe();
    expect(httpMock.expectOne('apis/proxies/v8/v1/notifications/v2/read').request.method).toBe('PATCH');
    expect(httpMock.expectOne('apis/proxies/v8/v1/notifications/mandatory/read').request.method).toBe('PATCH');
  });

  it('should fetch mandatory notifications with paging', () => {
    service.getMandatoryNotifications(2, 5).subscribe();
    const req = httpMock.expectOne('apis/proxies/v8/v1/notifications/mandatory/list?page=2&size=5');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should increment the unread count stream', () => {
    const counts: number[] = [];
    service.unreadCount$.subscribe(c => counts.push(c));
    service.updateUnreadCount();
    service.updateUnreadCount();
    expect(counts).toEqual([0, 1, 2]);
  });

  it('should emit clicked content', () => {
    let clicked: any;
    service.handleClick$.subscribe(c => clicked = c);
    service.emitClick({ identifier: 'do_1' });
    expect(clicked).toEqual({ identifier: 'do_1' });
  });
});
