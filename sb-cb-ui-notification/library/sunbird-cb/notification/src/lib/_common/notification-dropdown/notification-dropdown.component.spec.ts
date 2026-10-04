import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { NotificationDropdownComponent } from './notification-dropdown.component';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import { PeerReadOverlayService } from '../../_services/peer-read-overlay.service';

describe('NotificationDropdownComponent', () => {
  let component: NotificationDropdownComponent;
  let fixture: ComponentFixture<NotificationDropdownComponent>;
  let libNotificationsService: jasmine.SpyObj<LibNotificationsService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let overlayService: jasmine.SpyObj<PeerReadOverlayService>;
  const event = () => jasmine.createSpyObj<MouseEvent>('MouseEvent', ['stopPropagation']);

  beforeEach(() => {
    libNotificationsService = jasmine.createSpyObj<LibNotificationsService>('LibNotificationsService', [
      'getNotifications', 'getMandatoryNotifications', 'markAsRead', 'markMandatoryAsRead', 'updateUnreadCount',
    ]);
    libNotificationsService.getNotifications.and.callFake((_p: number, _s: number, subType: string) => of(
      subType === 'PEER_VALIDATION'
        ? { result: { notifications: [{ notification_id: 'p1' }] } }
        : { result: { notifications: [{ notification_id: 'n1' }, { notification_id: 'n2' }], subtypeStats: [{ name: 'ALERT', unread: 4 }] } },
    ));
    libNotificationsService.getMandatoryNotifications.and.returnValue(of({ result: { notifications: [{ notification_id: 'm1' }] } }));
    libNotificationsService.markAsRead.and.returnValue(of({ responseCode: 'OK' }));
    libNotificationsService.markMandatoryAsRead.and.returnValue(of({ responseCode: 'OK' }));
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    overlayService = jasmine.createSpyObj<PeerReadOverlayService>('PeerReadOverlayService', ['show', 'hide']);

    TestBed.configureTestingModule({
      declarations: [NotificationDropdownComponent],
      providers: [
        { provide: LibNotificationsService, useValue: libNotificationsService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: PeerReadOverlayService, useValue: overlayService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(NotificationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user, mandatory and peer validation notifications on init', () => {
    expect(libNotificationsService.getNotifications).toHaveBeenCalledWith(0, 5, 'all');
    expect(component.notifications.length).toBe(2);
    expect(component.alerts).toEqual({ name: 'ALERT', unread: 4 });
    expect(component.isLoading).toBe(false);
    expect(component.mandatoryNotificationsCount).toBe(1);
    expect(component.peerValidationsCount).toBe(1);
  });

  it('should stop loading when fetching notifications fails', () => {
    spyOn(console, 'error');
    libNotificationsService.getNotifications.and.returnValue(throwError('failed'));
    component.getUserNotifications();
    expect(component.isLoading).toBe(false);
  });

  it('should switch to cached mandatory and peer validation lists without refetching', () => {
    libNotificationsService.getNotifications.calls.reset();
    const e = event();
    component.loadNotifications('MANDATORY', e);
    expect(component.notifications).toBe(component.mandatoryNotifications);
    component.loadNotifications('PEER_VALIDATION', e);
    expect(component.notifications).toBe(component.peerValidations);
    expect(libNotificationsService.getNotifications).not.toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalledTimes(2);
  });

  it('should emit the current tab when viewing all', () => {
    spyOn(component.viewAllClick, 'emit');
    component.currentTab = 'ALERT';
    component.redirectToAll();
    expect(component.viewAllClick.emit).toHaveBeenCalledWith('ALERT');
  });

  it('should mark an unread notification as read and emit it', () => {
    spyOn(component.viewAllClick, 'emit');
    const notification: any = { notification_id: 'n1', read: false };
    component.redirectToNotification(notification, event());
    expect(libNotificationsService.markAsRead).toHaveBeenCalled();
    expect(notification.read).toBe(true);
    expect(component.viewAllClick.emit).toHaveBeenCalledWith(notification);
  });

  it('should use the mandatory read API on the mandatory tab', () => {
    component.currentTab = 'MANDATORY';
    const notification: any = { notification_id: 'm1', read: false };
    component.redirectToNotification(notification, event());
    expect(libNotificationsService.markMandatoryAsRead).toHaveBeenCalled();
    expect(notification.read).toBe(true);
  });

  it('should show the overlay for peer validation and report failures', () => {
    libNotificationsService.markAsRead.and.returnValue(throwError('failed'));
    const e = event();
    component.redirectToNotification({ notification_id: 'p1', read: false, sub_type: 'PEER_VALIDATION' }, e);
    expect(e.stopPropagation).toHaveBeenCalled();
    expect(overlayService.show).toHaveBeenCalled();
    expect(overlayService.hide).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Notification read failed', 'Close', { duration: 3000 });
  });

  it('should emit already read notifications without marking them', () => {
    spyOn(component.viewAllClick, 'emit');
    component.redirectToNotification({ notification_id: 'n2', read: true }, event());
    expect(libNotificationsService.markAsRead).not.toHaveBeenCalled();
    expect(component.viewAllClick.emit).toHaveBeenCalled();
  });

  it('should hide the overlay on destroy', () => {
    component.ngOnDestroy();
    expect(overlayService.hide).toHaveBeenCalled();
  });
});
