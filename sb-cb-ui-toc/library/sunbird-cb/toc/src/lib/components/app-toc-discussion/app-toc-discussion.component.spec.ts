import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { AppTocDiscussionComponent } from './app-toc-discussion.component'

describe('AppTocDiscussionComponent', () => {
  let component: AppTocDiscussionComponent
  let fixture: ComponentFixture<AppTocDiscussionComponent>
  const content: any = { identifier: 'do_1', name: 'Course', description: 'desc' }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocDiscussionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { data: of({ content: { data: content } }) } } },
        { provide: ConfigurationsService, useValue: { restrictedFeatures: new Set(['disscussionForum']) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocDiscussionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set restriction and build the discussion widget from route data', () => {
    expect(component.isRestricted).toBe(true)
    expect(component.content).toBe(content)
    expect(component.discussionForumWidget).toEqual(expect.objectContaining({
      widgetType: 'discussionForum',
      widgetSubType: 'discussionForum',
      widgetData: expect.objectContaining({ id: 'do_1', title: 'Course' }),
    }))
  })
})
