import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateModule } from '@ngx-translate/core'
import {
  ConfigurationsService, DataTransferService, EventService,
  LoggerService, MultilingualTranslationsService, TelemetryService,
  UtilityService, WidgetEnrollService,
} from '@sunbird-cb/utils-v2'
import { WidgetContentLibService, WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { BehaviorSubject, NEVER, of, Subject } from 'rxjs'

import { AppTocHomeComponent } from './app-toc-home.component'
import { WidgetContentService } from '../../_services/widget-content.service'
import { AppTocService } from '../../services/app-toc.service'
import { AccessControlService } from '../../services/access-control.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { HandleClaimService } from '../../_collection/_common/content-toc/content-services/handle-claim.service'
import { ActionService } from '../../services/action.service'
import { RatingService } from '../../_services/rating.service'
import { ViewerUtilService } from '../../services/viewer-util.service'
import { LoadCheckService } from '../../services/load-check.service'
import { ResetRatingsService } from '../../services/reset-ratings.service'
import { TimerService } from '../../services/timer.service'
import { NetCoreService } from '../../services/netcore.service'

describe('AppTocHomeComponent', () => {
  let component: AppTocHomeComponent
  let fixture: ComponentFixture<AppTocHomeComponent>
  let tocSvc: any

  beforeEach(waitForAsync(() => {
    tocSvc = {
      getSelectedBatch: new Subject<any>(),
      serverDate: new Subject<any>(),
      batchReplaySubject: new Subject<any>(),
      setBatchDataSubject: new Subject<any>(),
      contentLoader: new Subject<boolean>(),
      getServerDate: jest.fn().mockReturnValue(NEVER),
      changeServerDate: jest.fn(),
      fetchGetContentData: jest.fn().mockReturnValue(NEVER),
      initData: jest.fn().mockReturnValue({ content: null, errorCode: null }),
      analyticsFetchStatus: 'none',
    }
    TestBed.configureTestingModule({
      declarations: [AppTocHomeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { pageData: { data: { analytics: {}, learnerAdvisory: [] } } }, params: {}, queryParams: {} },
            data: of({}),
            params: of({}),
            queryParams: of({}),
            queryParamMap: of(convertToParamMap({})),
            fragment: of(null),
          },
        },
        { provide: Router, useValue: { navigate: jest.fn(), events: new Subject<any>(), url: '/app/toc/do_1/overview' } },
        { provide: WidgetContentService, useValue: { userKarmaPoints: jest.fn().mockReturnValue(NEVER) } },
        { provide: AppTocService, useValue: tocSvc },
        { provide: LoggerService, useValue: { error: jest.fn(), log: jest.fn() } },
        {
          provide: ConfigurationsService,
          useValue: {
            languageTranslationFlag: new BehaviorSubject<boolean>(false),
            restrictedFeatures: new Set<string>(),
            instanceConfig: { logos: { defaultSourceLogo: 'logo.png' } },
            userProfile: { userId: 'user1', rootOrgId: 'org1' },
          },
        },
        { provide: AccessControlService, useValue: {} },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MobileAppsService, useValue: { mobileTopHeaderVisibilityStatus: new Subject<boolean>(), sendViewerData: jest.fn() } },
        { provide: UtilityService, useValue: { isMobile: false } },
        { provide: ActionService, useValue: {} },
        { provide: ViewerUtilService, useValue: {} },
        { provide: RatingService, useValue: {} },
        { provide: TelemetryService, useValue: { telemetryConfig: { channel: 'channel1' } } },
        { provide: MultilingualTranslationsService, useValue: { translateLabel: jest.fn() } },
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn(), dispatchEvent: jest.fn() } },
        { provide: LoadCheckService, useValue: { childComponentLoaded$: new Subject<boolean>() } },
        { provide: HandleClaimService, useValue: { getClaimData: jest.fn().mockReturnValue(new Subject<any>()) } },
        { provide: ResetRatingsService, useValue: {} },
        { provide: TimerService, useValue: { getTimerData: jest.fn().mockReturnValue(new Subject<any>()) } },
        { provide: WidgetEnrollService, useValue: {} },
        { provide: WidgetContentLibService, useValue: {} },
        { provide: DataTransferService, useValue: { setEnrollData: jest.fn() } },
        { provide: WidgetUserServiceLib, useValue: { getRecommendedCoursesSakshamAI: jest.fn().mockReturnValue(of({ feedbacks: [] })) } },
        { provide: NetCoreService, useValue: {} },
        { provide: 'environment', useValue: { dakshtaName: 'Dakshta', cscmsUrl: '' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise defaults on init when no content is resolved', () => {
    expect(component.currentFragment).toBe('overview')
    expect(component.channelId).toBe('channel1')
    expect(component.defaultSLogo).toBe('logo.png')
    expect(tocSvc.getServerDate).toHaveBeenCalled()
    expect(tocSvc.fetchGetContentData).not.toHaveBeenCalled()
  })

  it('should track the selected batch from the toc service', () => {
    tocSvc.getSelectedBatch.next({ batchId: 'b1' })
    expect(component.selectedBatchData).toEqual({ batchId: 'b1' })
  })
})
