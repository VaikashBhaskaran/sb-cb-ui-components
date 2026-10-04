import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentCardComponent } from './content-card.component';
import { LibNotificationsService } from '../../_services/lib-notifications.service';


describe('ContentCardComponent', () => {
  let component: ContentCardComponent;
  let fixture: ComponentFixture<ContentCardComponent>;
  let libNotificationsService: jasmine.SpyObj<LibNotificationsService>;

  beforeEach(() => {
    libNotificationsService = jasmine.createSpyObj<LibNotificationsService>('LibNotificationsService', ['emitClick']);
    TestBed.configureTestingModule({
      declarations: [ContentCardComponent],
      providers: [{ provide: LibNotificationsService, useValue: libNotificationsService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentCardComponent);
    component = fixture.componentInstance;
    component.content = { identifier: 'do_1', name: 'Course', appIcon: 'icon.png' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default images on init', () => {
    expect(component.defaultThumbnail).toBe('/assets/instances/eagle/app_logos/default.png');
    expect(component.defaultSLogo).toBe('/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg');
  });

  it('should emit the clicked content through the notifications service', () => {
    component.getRedirectUrlData(component.content);
    expect(libNotificationsService.emitClick).toHaveBeenCalledWith(component.content);
  });
});
