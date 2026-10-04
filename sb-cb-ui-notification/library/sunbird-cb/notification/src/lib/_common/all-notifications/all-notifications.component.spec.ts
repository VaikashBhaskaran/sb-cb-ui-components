import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { AllNotificationsComponent } from './all-notifications.component';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import { PeerReadOverlayService } from '../../_services/peer-read-overlay.service';

describe('AllNotificationsComponent', () => {
  let component: AllNotificationsComponent;
  let fixture: ComponentFixture<AllNotificationsComponent>;
  let libNotificationsService: jasmine.SpyObj<LibNotificationsService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let overlayService: jasmine.SpyObj<PeerReadOverlayService>;

  const notificationsResponse = {
    result: {
      notifications: [{ notification_id: 'n1', read: false }, { notification_id: 'n2', read: true }],
      subtypeStats: [{ name: 'MANDATORY', read: 1, unread: 2 }, { name: 'ALERT', read: 0, unread: 3 }],
      hasNextPage: true,
    },
  };

  beforeEach(() => {
    libNotificationsService = jasmine.createSpyObj<LibNotificationsService>('LibNotificationsService', [
      'getNotifications', 'getMandatoryNotifications', 'markAsRead', 'markMandatoryAsRead', 'markAllAsRead', 'updateUnreadCount',
    ]);
    libNotificationsService.getNotifications.and.returnValue(of(notificationsResponse));
    libNotificationsService.getMandatoryNotifications.and.returnValue(of({ result: { notifications: [] } }));
    libNotificationsService.markAsRead.and.returnValue(of({ responseCode: 'OK' }));
    libNotificationsService.markMandatoryAsRead.and.returnValue(of({ responseCode: 'OK' }));
    libNotificationsService.markAllAsRead.and.returnValue(of({ responseCode: 'OK' }));
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    overlayService = jasmine.createSpyObj<PeerReadOverlayService>('PeerReadOverlayService', ['show', 'hide']);

    TestBed.configureTestingModule({
      declarations: [AllNotificationsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({ tab: 'ALERT' })) } },
        { provide: LibNotificationsService, useValue: libNotificationsService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: PeerReadOverlayService, useValue: overlayService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(AllNotificationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    expect(component).toBeTruthy();
  }));

  it('should load notifications, tabs and unread count for the tab in the query params', fakeAsync(() => {
    fixture.detectChanges();
    expect(libNotificationsService.getNotifications).toHaveBeenCalledWith(0, 10, 'ALERT');
    expect(component.tabs.map(t => t.name)).toEqual(['all', 'MANDATORY', 'ALERT']);
    expect(component.dynamicTabIndex).toBe(2);
    expect(component.unreadCount).toBe(5);
    expect(component.notifications.length).toBe(2);
    expect(component.hasNextPage).toBe(true);
    expect(component.loading).toBe(false);
    expect(libNotificationsService.getMandatoryNotifications).not.toHaveBeenCalled();
    tick(1000);
  }));

  it('should fetch mandatory notifications a second after init', fakeAsync(() => {
    libNotificationsService.getMandatoryNotifications.and.returnValue(of({
      result: { notifications: [{ notification_id: 'm1' }], subtypeStats: [{ name: 'EXTRA', unread: 1 }] },
    }));
    fixture.detectChanges();
    tick(1000);
    expect(libNotificationsService.getMandatoryNotifications).toHaveBeenCalledWith(0, 10);
    expect(component.tabs.map(t => t.name)).toContain('EXTRA');
    expect(component.unreadCount).toBe(6);
    expect(component.notifications.map(n => n.notification_id)).toEqual(['n1', 'n2', 'm1']);
  }));

  it('should stop loading when fetching notifications fails', fakeAsync(() => {
    spyOn(console, 'error');
    libNotificationsService.getNotifications.and.returnValue(throwError('failed'));
    fixture.detectChanges();
    tick(1000);
    expect(component.loading).toBe(false);
    expect(component.notifications).toEqual([]);
  }));

  it('should combine read/unread counts across multiple peer validation tabs', () => {
    libNotificationsService.getNotifications.and.returnValue(of({
      result: {
        notifications: [],
        subtypeStats: [{ name: 'PEER_VALIDATION', read: 1, unread: 2 }, { name: 'peer_validation', read: 3, unread: 4 }],
      },
    }));
    component.loadNotifications();
    const peerTabs = component.tabs.filter(t => t.name && t.name.toUpperCase() === 'PEER_VALIDATION');
    expect(peerTabs.every(t => t.read === 4 && t.unread === 6)).toBe(true);
  });

  it('should mark an unread notification as read and emit redirect', () => {
    const emitted: any[] = [];
    component.redirectTo.subscribe((n: any) => emitted.push(n));
    const notification: any = { notification_id: 'n1', read: false, sub_category: 'COURSE_PUBLISHED' };
    component.currentTab = 'all';
    component.redirectToNotification(notification);
    const request: any = libNotificationsService.markAsRead.calls.mostRecent().args[0];
    expect(request.request.ids).toEqual(['n1']);
    expect(request.request.action).toBe('global');
    expect(notification.read).toBe(true);
    expect(libNotificationsService.updateUnreadCount).toHaveBeenCalled();
    expect(emitted).toEqual([notification]);
  });

  it('should use the mandatory read API on the mandatory tab', () => {
    component.currentTab = 'MANDATORY';
    component.redirectToNotification({ notification_id: 'm1', read: false, type: 'MANDATORY' });
    expect(libNotificationsService.markMandatoryAsRead).toHaveBeenCalled();
    expect(libNotificationsService.markAsRead).not.toHaveBeenCalled();
  });

  it('should show and hide the overlay when marking peer validation, and report failures', () => {
    libNotificationsService.markAsRead.and.returnValue(throwError('failed'));
    component.currentTab = 'all';
    component.redirectToNotification({ notification_id: 'p1', read: false, category: 'PEER_VALIDATION' });
    expect(overlayService.show).toHaveBeenCalled();
    expect(overlayService.hide).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Notification read failed', 'Close', { duration: 3000 });
  });

  it('should emit redirect directly for already read notifications', () => {
    const emitted: any[] = [];
    component.redirectTo.subscribe((n: any) => emitted.push(n));
    component.redirectToNotification({ notification_id: 'n2', read: true });
    expect(libNotificationsService.markAsRead).not.toHaveBeenCalled();
    expect(emitted.length).toBe(1);
  });

  it('should mark all notifications as read', () => {
    component.notifications = [{ read: false }, { read: false }];
    component.unreadCount = 2;
    const event = jasmine.createSpyObj<MouseEvent>('MouseEvent', ['stopPropagation']);
    component.markAllAsRead(event);
    expect(component.notifications.every(n => n.read)).toBe(true);
    expect(component.unreadCount).toBe(0);
    expect(snackBar.open).toHaveBeenCalledWith('Marked as read.');
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should reset paging and load mandatory notifications when switching to the mandatory tab', () => {
    component.tabs = [{ id: 'all', name: 'all' }, { name: 'MANDATORY' }];
    component.pageNumber = 3;
    component.onTabChange(1);
    expect(component.currentTab).toBe('MANDATORY');
    expect(component.pageNumber).toBe(0);
    expect(libNotificationsService.getMandatoryNotifications).toHaveBeenCalledWith(0, 10);
  });

  it('should format helpers', () => {
    expect(component.capitalize('PEER_VALIDATION')).toBe('Peer Validation');
    expect(component.getCount(1, 2)).toBe('(3)');
    expect(component.getCount(0, 0)).toBe('');
    expect(component.getIconPath('NETWORK')).toBe('assets/icons/notifications-engine/network.svg');
    expect(component.getIconPath('UNKNOWN')).toBe('assets/icons/notifications-engine/learn.svg');
    expect(component.getTimeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())).toBe('2h');
  });

  it('should toggle notification expansion', () => {
    const notification: any = { isExpanded: false };
    component.action(notification);
    expect(notification.isExpanded).toBe(true);
    component.action(notification);
    expect(notification.isExpanded).toBe(false);
  });

  it('should hide the overlay on destroy', () => {
    component.ngOnDestroy();
    expect(overlayService.hide).toHaveBeenCalled();
  });
});
