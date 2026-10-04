import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { LoggerService, ConfigurationsService, WidgetContentService } from '@sunbird-cb/utils-v2'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { of, Subject } from 'rxjs'

import { AppTocAboutComponent } from './app-toc-about.component'
import { RatingService } from '../../../../_services/rating.service'
import { AppTocService } from '../../../../services/app-toc.service'
import { TimerService } from '../../../../services/timer.service'
import { HandleClaimService } from '../content-services/handle-claim.service'
import { LoadCheckService } from '../../../../services/load-check.service'
import { ReviewComponentDataService } from '../content-services/review-component-data.service'
import { ResetRatingsService } from '../../../../services/reset-ratings.service'
import { DiscussUtilsService } from '../../../../services/discuss-utils.service'

@Pipe({ name: 'replaceNbsp', standalone: false })
class MockReplaceNbspPipe implements PipeTransform {
  transform(value: any) { return value }
}

@Pipe({ name: 'pipeSafeSanitizer', standalone: false })
class MockPipeSafeSanitizerPipe implements PipeTransform {
  transform(value: any) { return value }
}

@Pipe({ name: 'pipeRelativeTime', standalone: false })
class MockPipeRelativeTimePipe implements PipeTransform {
  transform(value: any) { return value }
}

describe('AppTocAboutComponent', () => {
  let component: AppTocAboutComponent
  let fixture: ComponentFixture<AppTocAboutComponent>
  let selectedBatch$: Subject<any>
  let resetRatings$: Subject<any>

  beforeEach(waitForAsync(() => {
    selectedBatch$ = new Subject<any>()
    resetRatings$ = new Subject<any>()
    TestBed.configureTestingModule({
      declarations: [
        AppTocAboutComponent,
        MockReplaceNbspPipe,
        MockPipeSafeSanitizerPipe,
        MockPipeRelativeTimePipe,
      ],
      imports: [TranslateModule.forRoot(), MatTooltipModule],
      providers: [
        {
          provide: RatingService,
          useValue: {
            getRatingSummary: jest.fn().mockReturnValue(of({})),
            getRatingLookup: jest.fn().mockReturnValue(of({})),
            getRatingIcon: jest.fn().mockReturnValue('star'),
            getRatingIconClass: jest.fn().mockReturnValue(false),
          },
        },
        { provide: LoggerService, useValue: { error: jest.fn(), log: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: LoadCheckService, useValue: { componentLoaded: jest.fn() } },
        { provide: TimerService, useValue: { getTimerData: jest.fn().mockReturnValue(of({})) } },
        {
          provide: AppTocService,
          useValue: {
            getSelectedBatch: selectedBatch$,
            getTocStructure: jest.fn((_content: any, structure: any) => structure),
          },
        },
        {
          provide: ConfigurationsService,
          useValue: {
            compentency: { v5: { vKey: 'competencies_v5' } },
            userProfile: { userId: 'u1' },
          },
        },
        { provide: DiscussUtilsService, useValue: {} },
        { provide: Router, useValue: { url: '/app/toc/do_1/overview', navigate: jest.fn(), navigateByUrl: jest.fn().mockResolvedValue(true) } },
        { provide: ReviewComponentDataService, useValue: { setReviewData: jest.fn() } },
        { provide: HandleClaimService, useValue: { handleClaim: jest.fn() } },
        { provide: ResetRatingsService, useValue: { resetRatings$ } },
        { provide: WidgetContentService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { pageData: { data: { about: true } } } } } },
        { provide: CommonMethodsService, useValue: {} },
        { provide: 'environment', useValue: { compentencyVersionKey: 'v5' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    fixture = TestBed.createComponent(AppTocAboutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should read page config and competency key on init', () => {
    expect(component.pageConfigData).toEqual({ about: true })
    expect(component.compentencyKey).toEqual({ vKey: 'competencies_v5' })
    expect(component.userProfile).toEqual({ userId: 'u1' })
  })

  it('should compute batch full state from the selected batch', () => {
    selectedBatch$.next({ userCount: { enrolled: 9 }, content: [{ batchAttributes: { currentBatchSize: 10 } }] })
    expect(component.isBatchFull).toBe(false)
    expect(component.showLimitedSeatsMsg).toBe(true)
    selectedBatch$.next({ userCount: { enrolled: 10 }, content: [{ batchAttributes: { currentBatchSize: 10 } }] })
    expect(component.isBatchFull).toBe(true)
    expect(component.showLimitedSeatsMsg).toBe(false)
  })

  it('should capitalize strings', () => {
    expect(component.handleCapitalize('hello world')).toBe('Hello world')
    expect(component.handleCapitalize('hello world', 'name')).toBe('Hello World')
  })

  it('should compute star percentage', () => {
    expect(component.countStarsPercentage(2, 5, 20)).toBe('50.00')
    expect(component.countStarsPercentage(0, 5, 20)).toBe(0)
  })

  it('should emit survey form trigger', () => {
    const emitSpy = jest.spyOn(component.trigerCompletionSurveyForm, 'emit')
    component.openSurveyFormPopup()
    expect(emitSpy).toHaveBeenCalledWith(true)
  })
})
