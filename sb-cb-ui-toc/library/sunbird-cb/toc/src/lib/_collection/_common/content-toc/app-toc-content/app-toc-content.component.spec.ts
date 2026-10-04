import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { BehaviorSubject, of, Subject } from 'rxjs'

import { AppTocContentComponent } from './app-toc-content.component'
import { AppTocService } from '../../../../services/app-toc.service'

describe('AppTocContentComponent', () => {
  let component: AppTocContentComponent
  let fixture: ComponentFixture<AppTocContentComponent>
  let tocSvc: any

  beforeEach(waitForAsync(() => {
    tocSvc = {
      resumeData: new BehaviorSubject<any>(null),
      contentLoader$: new BehaviorSubject<boolean>(false),
      hashmapUpdated$: new Subject<any>(),
    }
    TestBed.configureTestingModule({
      declarations: [AppTocContentComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ batchId: 'batch_1', contextId: 'ctx_1', contextPath: 'Course' })),
            parent: { data: of({}) },
          },
        },
        { provide: AppTocService, useValue: tocSvc },
        { provide: ConfigurationsService, useValue: { instanceConfig: { logos: { defaultContent: 'default.png' } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should read context and batch from query params', () => {
    expect(component.batchId).toBe('batch_1')
    expect(component.contextId).toBe('ctx_1')
    expect(component.contextPath).toBe('Course')
    expect(component.isEnrolled).toBe(true)
  })

  it('should set default thumbnail from instance config', () => {
    expect(component.defaultThumbnail).toBe('default.png')
  })

  it('should update hierarchy map data on hashmap updates', () => {
    const hashmap = { do_1: { completionStatus: 2 } }
    tocSvc.hashmapUpdated$.next({ hashmap })
    expect(component.hierarchyMapData).toBe(hashmap)
  })

  it('should report milestone completion from hierarchy data', () => {
    component.content = { identifier: 'do_lp' } as any
    component.hierarchyMapData = {
      m1: { primaryCategory: 'Course' },
      c1: { parent: 'm1', primaryCategory: 'Course', completionStatus: 2 },
      a1: { parent: 'm1', primaryCategory: 'Course Assessment', completionPercentage: 100 },
    }
    expect(component.getMilestoneCompletedOrNot('m1')).toBe(true)
    component.hierarchyMapData.c1.completionStatus = 1
    expect(component.getMilestoneCompletedOrNot('m1')).toBe(false)
    expect(component.getMilestoneCompletedOrNot('missing')).toBe(false)
  })
})
