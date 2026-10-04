import { signal } from '@angular/core'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTabsModule } from '@angular/material/tabs'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { of } from 'rxjs'
import { HighlightPipe } from '../../../_pipes/highlight.pipe'

import { ContentTocComponent } from './content-toc.component'

/**
 * Covers the comprehensive assessment additions: the pending-course list that tells the learner
 * what is still holding the assessment back, and the breadcrumb trail built from the plan.
 *
 * The component is built off its prototype rather than through TestBed, so these tests exercise
 * that logic without standing up its full dependency graph.
 */

const CA_CATEGORY = 'Comprehensive Assessment'

const PENDING_COURSE = {
  identifier: 'do_courseA',
  name: 'Overview of Basic Statistics',
  code: 'LRN-W01',
  mandatory: true,
  completed: false,
}

/** Lets the promise callbacks inside loadComprehensiveAssessmentStatus() run. */
function flushPromises(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, 0))
}

function createComponent(overrides: Record<string, any> = {}): any {
  const component: any = Object.create(ContentTocComponent.prototype)
  component.caPendingCourses = []
  component.breadcrumbData = signal<any[]>([])
  component.caBreadcrumbs = signal<any[]>([])
  component.content = null
  component.contentReadData = null
  component.comprehensiveAssessmentSvc = {
    getUnlockStatus: jest.fn(() => Promise.resolve({
      courses: [], pendingCourses: [], isAllCoursesCompleted: true,
    })),
  }
  return Object.assign(component, overrides)
}

describe('ContentTocComponent', () => {

  describe('loadComprehensiveAssessmentStatus', () => {

    it('lists the courses the assessment is still waiting on', async () => {
      const component = createComponent({
        content: { courseCategory: CA_CATEGORY },
        contentReadData: { courseCategory: CA_CATEGORY },
      })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockResolvedValue({
        courses: [PENDING_COURSE],
        pendingCourses: [PENDING_COURSE],
        isAllCoursesCompleted: false,
      })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.caPendingCourses).toEqual([PENDING_COURSE])
    })

    it('empties the list once nothing is pending', async () => {
      const component = createComponent({
        content: { courseCategory: CA_CATEGORY },
        caPendingCourses: [PENDING_COURSE],
      })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.caPendingCourses).toEqual([])
    })

    it('does not run for content that is not a comprehensive assessment', async () => {
      const component = createComponent({
        content: { courseCategory: 'Course' },
        caPendingCourses: [PENDING_COURSE],
      })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.comprehensiveAssessmentSvc.getUnlockStatus).not.toHaveBeenCalled()
      expect(component.caPendingCourses).toEqual([])
      expect(component.breadcrumbData()).toEqual([])
    })

    it('empties the list when the lookup fails', async () => {
      const component = createComponent({
        content: { courseCategory: CA_CATEGORY },
        caPendingCourses: [PENDING_COURSE],
      })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockRejectedValue(new Error('lookup failed'))

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.caPendingCourses).toEqual([])
    })
  })

  describe('setBreadcrumbData', () => {

    it('links the plan crumb to the plan detail page for its reporting year', () => {
      const component = createComponent({
        contentReadData: {
          courseCategory: CA_CATEGORY,
          trainingPlan_v2: { identifier: 'plan-1', planYear: '2026-27', orgName: 'Ministry of Rural Development' },
        },
      })

      component['setBreadcrumbData']()

      expect(component.breadcrumbData()).toEqual([
        { url: '/page/home', title: 'Home', icon: '' },
        { url: '/app/plans', queryParams: { planType: 'apar' }, title: 'APAR', icon: '' },
        {
          url: '/app/plans/plan-1',
          queryParams: { planYear: '2026-27' },
          title: 'Ministry of Rural Development',
          icon: '',
        },
        { url: '', title: CA_CATEGORY, icon: '' },
      ])
    })

    it('falls back to the content source when the plan carries no org name', () => {
      const component = createComponent({
        contentReadData: {
          source: 'Karmayogi Bharat',
          trainingPlan_v2: { identifier: 'plan-1', orgName: '' },
        },
      })

      component['setBreadcrumbData']()

      expect(component.breadcrumbData()[2]).toEqual(expect.objectContaining({
        title: 'Karmayogi Bharat',
        url: '/app/plans/plan-1',
        queryParams: undefined,
      }))
    })

    it('falls back to the owning organisation when there is no source either', () => {
      const component = createComponent({
        contentReadData: { organisation: ['JPAL'], trainingPlan_v2: { identifier: 'plan-1' } },
      })

      component['setBreadcrumbData']()

      expect(component.breadcrumbData()[2].title).toBe('JPAL')
    })

    it('leaves the plan crumb out when no name can be resolved', () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })

      component['setBreadcrumbData']()

      const crumbs = component.breadcrumbData()
      expect(crumbs.length).toBe(3)
      expect(crumbs.map((crumb: any) => crumb.title)).toEqual(['Home', 'APAR', CA_CATEGORY])
    })

    it('renders the plan crumb as plain text when the plan has no identifier', () => {
      const component = createComponent({
        contentReadData: { trainingPlan_v2: { orgName: 'Ministry of Rural Development' } },
      })

      component['setBreadcrumbData']()

      expect(component.breadcrumbData()[2].url).toBe('')
    })

    it('names the last crumb after the course category, defaulting when absent', () => {
      const component = createComponent({ contentReadData: {} })

      component['setBreadcrumbData']()

      const crumbs = component.breadcrumbData()
      expect(crumbs[crumbs.length - 1]).toEqual({ url: '', title: CA_CATEGORY, icon: '' })
    })
  })

  describe('TestBed', () => {
    let component: ContentTocComponent
    let fixture: ComponentFixture<ContentTocComponent>

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContentTocComponent, HighlightPipe],
        imports: [MatDialogModule, MatTabsModule, TranslateModule.forRoot()],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([]),
          provideNoopAnimations(),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: {}, params: {}, queryParams: {} },
              data: of({}),
              params: of({}),
              queryParams: of({}),
              queryParamMap: of(convertToParamMap({})),
            },
          },
          { provide: 'environment', useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
    }))

    beforeEach(() => {
      fixture = TestBed.createComponent(ContentTocComponent)
      component = fixture.componentInstance
      component.content = {}
      component.contentReadData = {}
      fixture.detectChanges()
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })
})
