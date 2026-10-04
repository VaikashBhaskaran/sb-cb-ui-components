import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { AppTocOverviewComponent } from './app-toc-overview.component'
import { AppTocService } from '../../services/app-toc.service'
import { AccessControlService } from '../../services/access-control.service'

describe('AppTocOverviewComponent', () => {
  let component: AppTocOverviewComponent
  let fixture: ComponentFixture<AppTocOverviewComponent>
  let tocSharedSvc: any
  const routeData = { pageData: { data: { overview: true } } }

  beforeEach(waitForAsync(() => {
    tocSharedSvc = {
      initData: jest.fn().mockReturnValue({ content: null, errorCode: null }),
      fetchContentParent: jest.fn().mockReturnValue(of({ collections: [] })),
      getTocStructure: jest.fn((_content: any, structure: any) => structure),
      subtitleOnBanners: false,
      showDescription: false,
    }
    TestBed.configureTestingModule({
      declarations: [AppTocOverviewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { data: of(routeData) } } },
        { provide: AppTocService, useValue: tocSharedSvc },
        { provide: ConfigurationsService, useValue: { restrictedFeatures: new Set<string>() } },
        { provide: AccessControlService, useValue: { proxyToAuthoringUrl: jest.fn((url: string) => url) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise from parent route data', () => {
    expect(tocSharedSvc.initData).toHaveBeenCalledWith(routeData)
    expect(component.tocConfig).toEqual({ overview: true })
    expect(component.tocStructure).toBeTruthy()
  })

  it('should group content parents by content type', () => {
    component.contentParents = {}
    component.parseContentParent({
      collections: [
        { contentType: 'Course', collections: [{ contentType: 'Program', collections: [] }] },
      ],
    } as any)
    expect(Object.keys(component.contentParents).sort()).toEqual(['Course', 'Program'])
  })
})
