import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { KnowledgeArtifactDetailsComponent } from './knowledge-artifact-details.component'
import { AppTocService } from '../../services/app-toc.service'
import { WidgetContentService } from '../../_services/widget-content.service'
import { EditorService } from '../../services/editor.service'

describe('KnowledgeArtifactDetailsComponent', () => {
  let component: KnowledgeArtifactDetailsComponent
  let fixture: ComponentFixture<KnowledgeArtifactDetailsComponent>
  let tocSharedSvc: any
  let editorSvc: { deleteContent: jest.Mock }
  let router: { navigate: jest.Mock }

  beforeEach(waitForAsync(() => {
    tocSharedSvc = {
      initData: jest.fn().mockReturnValue({ content: null, errorCode: null }),
      fetchContentWhatsNext: jest.fn().mockReturnValue(of([])),
      getTocStructure: jest.fn((_content: any, structure: any) => structure),
      subtitleOnBanners: false,
      showDescription: false,
    }
    editorSvc = { deleteContent: jest.fn().mockReturnValue(of({})) }
    router = { navigate: jest.fn() }
    TestBed.configureTestingModule({
      declarations: [KnowledgeArtifactDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({}) } },
        { provide: Router, useValue: router },
        { provide: AppTocService, useValue: tocSharedSvc },
        { provide: ConfigurationsService, useValue: { pageNavBar: {}, restrictedFeatures: new Set<string>() } },
        { provide: WidgetContentService, useValue: { setS3Cookie: jest.fn().mockReturnValue(of({})) } },
        { provide: EditorService, useValue: editorSvc },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeArtifactDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise from route data', () => {
    expect(tocSharedSvc.initData).toHaveBeenCalledWith({})
    expect(component.content).toBeNull()
    expect(component.tocStructure).toBeTruthy()
  })

  it('should delete content and navigate home', () => {
    component.content = { identifier: 'do_1' } as any
    component.deleteContent()
    expect(editorSvc.deleteContent).toHaveBeenCalledWith('do_1')
    expect(component.deletingContent).toBe(false)
    expect(router.navigate).toHaveBeenCalledWith(['/page/home'])
  })

  it('should report greyed image for deleted content', () => {
    expect(component.isGreyedImage).toBe(false)
    component.content = { status: 'Deleted' } as any
    expect(component.isGreyedImage).toBe(true)
  })
})
