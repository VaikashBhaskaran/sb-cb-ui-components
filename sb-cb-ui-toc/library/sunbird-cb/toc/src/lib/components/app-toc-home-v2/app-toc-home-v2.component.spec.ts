import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router'
import { MatDialogModule } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { PipeCountTransformModule, PipePublicURLModule, TelemetryService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { AppTocHomeV2Component } from './app-toc-home-v2.component'

/**
 * Covers the comprehensive assessment call-to-action: whether the page shows Locked or Enroll,
 * and what the attempts line reports.
 *
 * The component is built off its prototype rather than through TestBed, so these tests exercise
 * that logic without standing up its full dependency graph.
 */

const CA_CATEGORY = 'Comprehensive Assessment'

const NO_ATTEMPTS = { attemptsMade: 0, attemptsAllowed: 0, attemptsRemaining: 0, isAttempted: false }

/** Lets the promise callbacks inside loadComprehensiveAssessmentStatus() run. */
function flushPromises(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, 0))
}

function createComponent(overrides: Record<string, any> = {}): any {
  const component: any = Object.create(AppTocHomeV2Component.prototype)
  component.comprehensiveAssessmentCategory = CA_CATEGORY
  component.isAllCoursesCompleted = false
  component.assessmentAttempts = { ...NO_ATTEMPTS }
  component.content = null
  component.contentReadData = null
  component.loggerSvc = { warn: jest.fn(), error: jest.fn() }
  component.comprehensiveAssessmentSvc = {
    getUnlockStatus: jest.fn(() => Promise.resolve({
      courses: [], pendingCourses: [], isAllCoursesCompleted: false,
    })),
    getAttemptStatus: jest.fn(() => Promise.resolve({ ...NO_ATTEMPTS })),
  }
  return Object.assign(component, overrides)
}

describe('AppTocHomeV2Component', () => {

  describe('isComprehensiveAssessment', () => {

    it('is true when the content read is a comprehensive assessment', () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      expect(component.isComprehensiveAssessment).toBe(true)
    })

    it('is true when only the content carries the category', () => {
      const component = createComponent({ content: { courseCategory: CA_CATEGORY } })
      expect(component.isComprehensiveAssessment).toBe(true)
    })

    it('is false for any other course category', () => {
      const component = createComponent({ contentReadData: { courseCategory: 'Course' } })
      expect(component.isComprehensiveAssessment).toBe(false)
    })
  })

  describe('isAssessmentLocked', () => {

    it('locks a comprehensive assessment while courses are outstanding', () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: false,
      })
      expect(component.isAssessmentLocked).toBe(true)
    })

    it('unlocks once every mandatory course is completed', () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: true,
      })
      expect(component.isAssessmentLocked).toBe(false)
    })

    it('never locks content that is not a comprehensive assessment', () => {
      const component = createComponent({
        contentReadData: { courseCategory: 'Course' },
        isAllCoursesCompleted: false,
      })
      expect(component.isAssessmentLocked).toBe(false)
    })
  })

  describe('attempts', () => {

    it('reports the remaining attempts and the attempted state', () => {
      const component = createComponent({
        assessmentAttempts: { attemptsMade: 1, attemptsAllowed: 3, attemptsRemaining: 2, isAttempted: true },
      })

      expect(component.isAssessmentAttempted).toBe(true)
      expect(component.assessmentAttemptsRemaining).toBe(2)
      expect(component.totalAssessmentAttempts).toBe(3)
    })

    it('falls back to the authored attempt count when the API supplied none', () => {
      const component = createComponent({
        contentReadData: { maxAssessmentRetakeAttempts: 5 },
        assessmentAttempts: { ...NO_ATTEMPTS },
      })

      expect(component.totalAssessmentAttempts).toBe(5)
    })

    it('reports zero when neither the API nor the author supplied a total', () => {
      const component = createComponent({ contentReadData: {} })
      expect(component.totalAssessmentAttempts).toBe(0)
    })
  })

  describe('loadComprehensiveAssessmentStatus', () => {

    it('does nothing for content that is not a comprehensive assessment', async () => {
      const component = createComponent({ contentReadData: { courseCategory: 'Course' } })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.comprehensiveAssessmentSvc.getUnlockStatus).not.toHaveBeenCalled()
      expect(component.comprehensiveAssessmentSvc.getAttemptStatus).not.toHaveBeenCalled()
    })

    it('unlocks the call-to-action when the service reports every course complete', async () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockResolvedValue({
        courses: [], pendingCourses: [], isAllCoursesCompleted: true,
      })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.isAllCoursesCompleted).toBe(true)
      expect(component.isAssessmentLocked).toBe(false)
    })

    it('keeps the assessment locked when the unlock lookup fails', async () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: true,
      })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockRejectedValue(new Error('lookup failed'))

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.isAllCoursesCompleted).toBe(false)
      expect(component.isAssessmentLocked).toBe(true)
      expect(component.loggerSvc.warn).toHaveBeenCalled()
    })

    it('does not look up the attempts while the retake lookup is switched off', async () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.comprehensiveAssessmentSvc.getAttemptStatus).not.toHaveBeenCalled()
      expect(component.assessmentAttempts).toEqual(NO_ATTEMPTS)
    })
  })

  describe('TestBed', () => {
    let component: AppTocHomeV2Component
    let fixture: ComponentFixture<AppTocHomeV2Component>

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppTocHomeV2Component],
        imports: [
          MatDialogModule,
          MatMenuModule,
          MatSnackBarModule,
          TranslateModule.forRoot(),
          PipeCountTransformModule,
          PipePublicURLModule,
        ],
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
              fragment: of(null),
            },
          },
          { provide: 'environment', useValue: {} },
          { provide: TelemetryService, useValue: { telemetryConfig: { channel: '' } } },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
    }))

    beforeEach(() => {
      fixture = TestBed.createComponent(AppTocHomeV2Component)
      component = fixture.componentInstance
      fixture.detectChanges()
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })
})
