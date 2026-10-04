import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { TranslateModule } from '@ngx-translate/core'
import {
  ConfigurationsService,
  EventService,
  LoggerService,
  MultilingualTranslationsService,
  PipeCountTransformModule,
  PipeLimitToModule,
  PipePartialContentModule,
  PipePublicURLModule,
  UtilityService,
} from '@sunbird-cb/utils-v2'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { of, Subject } from 'rxjs'

import { AppTocBannerComponent } from './app-toc-banner.component'
import { AppTocService } from '../../services/app-toc.service'
import { WidgetContentService } from '../../_services/widget-content.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { TitleTagService } from '../../services/title-tag.service'
import { ActionService } from '../../services/action.service'
import { UserAutocompleteService } from '../../_collection/_common/user-autocomplete/user-autocomplete.service'
import { TimerService } from '../../services/timer.service'

describe('AppTocBannerComponent', () => {
  let component: AppTocBannerComponent
  let fixture: ComponentFixture<AppTocBannerComponent>
  let tocSvcMock: any

  beforeEach(waitForAsync(() => {
    tocSvcMock = {
      serverDate: new Subject<any>(),
      setWFDataSubject: new Subject<any>(),
      getSelectedBatch: new Subject<any>(),
      analyticsFetchStatus: 'none',
    }
    TestBed.configureTestingModule({
      declarations: [AppTocBannerComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatMenuModule,
        MatAutocompleteModule,
        PipeCountTransformModule,
        PipeLimitToModule,
        PipePartialContentModule,
        PipePublicURLModule,
      ],
      providers: [
        DatePipe,
        { provide: Router, useValue: { events: new Subject(), url: '/app/toc/do_1/overview', navigate: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pageData: { data: {} } }), queryParamMap: of(convertToParamMap({})) },
        },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: AppTocService, useValue: tocSvcMock },
        { provide: WidgetContentService, useValue: {} },
        { provide: UtilityService, useValue: { isMobile: false } },
        { provide: MobileAppsService, useValue: {} },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: ConfigurationsService, useValue: { restrictedFeatures: new Set(['goals']) } },
        { provide: TitleTagService, useValue: {} },
        { provide: ActionService, useValue: {} },
        { provide: LoggerService, useValue: { log: jest.fn(), error: jest.fn() } },
        { provide: UserAutocompleteService, useValue: { searchUser: jest.fn().mockReturnValue(of({})) } },
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn() } },
        {
          provide: MultilingualTranslationsService,
          useValue: { languageSelectedObservable: of(), translateLabel: jest.fn(), translateActualLabel: jest.fn() },
        },
        { provide: TimerService, useValue: {} },
        { provide: CommonMethodsService, useValue: {} },
        { provide: 'environment', useValue: { helpEmail: 'help@example.com' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocBannerComponent)
    component = fixture.componentInstance
    // ngOnChanges is normally triggered by the parent's input bindings
    component.ngOnChanges({})
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component.helpEmail).toBe('help@example.com')
  })

  it('should read restricted features and route page data on init', () => {
    expect(component.isGoalsEnabled).toBe(false)
    expect(component.tocConfig).toEqual({})
  })

  it('should return star rating icons based on the average rating', () => {
    component.content = { averageRating: 3.5 } as any
    expect(component.getRatingIcon(3)).toBe('star')
    expect(component.getRatingIcon(4)).toBe('star_half')
    expect(component.getRatingIcon(5)).toBe('star_border')
  })

  it('should reset analytics status on destroy', () => {
    tocSvcMock.analyticsFetchStatus = 'done'
    fixture.destroy()
    expect(tocSvcMock.analyticsFetchStatus).toBe('none')
  })
})
