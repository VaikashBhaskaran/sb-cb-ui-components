import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBar } from '@angular/material/snack-bar'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService, EventService, PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { ContentLanguageService } from '@sunbird-cb/consumption'
import { BehaviorSubject, Subject } from 'rxjs'

import { AppTocContentCardV2Component } from './app-toc-content-card-v2.component'
import { TruncatePipe } from '../pipes/truncate.pipe'
import { CertificateService } from '../../../../services/certificate.service'
import { AppTocService } from '../../../../services/app-toc.service'
import { ResourceDownloadHelperService } from '../../../../services/resource-download-helper.service'

describe('AppTocContentCardV2Component', () => {
  let component: AppTocContentCardV2Component
  let fixture: ComponentFixture<AppTocContentCardV2Component>
  let appTocSvcMock: any

  beforeEach(waitForAsync(() => {
    appTocSvcMock = {
      hashmapUpdated$: new Subject<any>(),
      updatePageScroll: new BehaviorSubject<boolean>(false),
      getPageScroll: new BehaviorSubject<boolean>(false),
      generateMilestoneAchievement: jest.fn(),
    }
    TestBed.configureTestingModule({
      declarations: [AppTocContentCardV2Component, TruncatePipe],
      imports: [TranslateModule.forRoot(), MatMenuModule, PipeDurationTransformModule],
      providers: [
        provideNoopAnimations(),
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: CertificateService, useValue: {} },
        { provide: AppTocService, useValue: appTocSvcMock },
        { provide: ContentLanguageService, useValue: { getSelectedLanguage: jest.fn() } },
        { provide: ResourceDownloadHelperService, useValue: {} },
        { provide: ConfigurationsService, useValue: { userProfile: { userId: 'user-1' } } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentCardV2Component)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should render a resource content card', () => {
    component.content = {
      identifier: 'do_1',
      name: 'Intro video',
      primaryCategory: 'Learning Resource',
      mimeType: 'video/mp4',
      duration: '120',
    } as any
    component.rootId = 'do_root'
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should unsubscribe from subscriptions on destroy', () => {
    fixture.detectChanges()
    const scrollSub = component.pageScrollSubscription!
    const hashSub = component.hashmapUpdatedSubscription!
    fixture.destroy()
    expect(scrollSub.closed).toBe(true)
    expect(hashSub.closed).toBe(true)
  })
})
