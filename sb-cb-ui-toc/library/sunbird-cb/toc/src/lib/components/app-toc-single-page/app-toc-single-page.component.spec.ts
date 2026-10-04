import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService, EventService, LoggerService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { of, Subject } from 'rxjs'

import { AppTocSinglePageComponent } from './app-toc-single-page.component'
import { AppTocService } from '../../services/app-toc.service'
import { AccessControlService } from '../../services/access-control.service'
import { TitleTagService } from '../../services/title-tag.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { ConnectionHoverService } from '../../_collection/_common/connection-hover-card/connection-hover.servive'
import { RatingService } from '../../_services/rating.service'

describe('AppTocSinglePageComponent', () => {
  let component: AppTocSinglePageComponent
  let fixture: ComponentFixture<AppTocSinglePageComponent>
  let tocSvc: any

  beforeEach(waitForAsync(() => {
    tocSvc = {
      getSelectedBatch: new Subject<any>(),
      updateReviewsObservable: new Subject<boolean>(),
      subtitleOnBanners: false,
      showDescription: false,
      initData: jest.fn().mockReturnValue({ content: null, errorCode: null }),
    }
    TestBed.configureTestingModule({
      declarations: [AppTocSinglePageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ActivatedRoute, useValue: { fragment: of(''), data: of({}), snapshot: { data: {}, params: {}, queryParams: {} } } },
        { provide: AppTocService, useValue: tocSvc },
        { provide: AccessControlService, useValue: {} },
        { provide: LoggerService, useValue: { error: jest.fn(), log: jest.fn() } },
        { provide: TitleTagService, useValue: { setSocialMediaTags: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MobileAppsService, useValue: { sendViewerData: jest.fn() } },
        { provide: ConfigurationsService, useValue: { userProfile: { userId: 'user1' }, userRoles: new Set(['editor']) } },
        { provide: ConnectionHoverService, useValue: {} },
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn() } },
        { provide: RatingService, useValue: { getRatingSummary: jest.fn().mockReturnValue(of({})) } },
        { provide: MultilingualTranslationsService, useValue: { translateLabel: jest.fn() } },
        { provide: 'environment', useValue: { compentencyVersionKey: 'v5' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSinglePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise user and environment details on init', () => {
    expect(component.compentencyKey).toBe('v5')
    expect(component.loggedInUserId).toBe('user1')
    expect(component.isNotEditor).toBe(false)
  })

  it('should track the selected batch from the toc service', () => {
    tocSvc.getSelectedBatch.next({ batchId: 'b1' })
    expect(component.selectedBatchData).toEqual({ batchId: 'b1' })
  })
})
