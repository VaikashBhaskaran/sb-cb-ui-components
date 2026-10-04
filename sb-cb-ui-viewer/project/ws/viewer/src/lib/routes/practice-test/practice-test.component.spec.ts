import { PracticeTestComponent } from './practice-test.component'
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap } from '@angular/router'
import { EventService, LoggerService, WsEvents } from '@sunbird-cb/utils'
import { ViewerUtilService } from '../../viewer-util.service'
import { MatDialog } from '@angular/material/dialog'
import { EMPTY, of } from 'rxjs'
import { fakeAsync, tick } from '@angular/core/testing'
import { NsContent } from '@sunbird-cb/collection'
import { AccessControlService } from '@sunbird-cb/toc'

describe('PracticeTestComponent', () => {
  let component: PracticeTestComponent
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockAccessControlService: jasmine.SpyObj<AccessControlService>
  let mockViewerUtilService: jasmine.SpyObj<ViewerUtilService>
  let mockEventService: jasmine.SpyObj<EventService>
  let mockLoggerService: jasmine.SpyObj<LoggerService>
  let mockMatDialog: jasmine.SpyObj<MatDialog>
  let mockContentService: any
  let mockRouter: any

  const mockTestData: NsContent.IContent = {
    identifier: 'test-id',
    maxQuestions: 10,
    allowSkip: 'Yes',
    requiresSubmit: 'Yes',
    expectedDuration: 300,
    artifactUrl: 'test-url',
    mimeType: NsContent.EMimeTypes.PDF,
  } as unknown as NsContent.IContent

  beforeEach(() => {
    // Setup mocks with proper param maps
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ resourceId: 'test-resource' }),
        queryParamMap: convertToParamMap({
          preview: 'false',
          batchId: 'test-batch'
        }),
        url: [],
        params: {},
        queryParams: {},
        fragment: '',
        data: {},
        outlet: '',
        component: null,
        routeConfig: null,
        root: new ActivatedRouteSnapshot,
        parent: new ActivatedRouteSnapshot,
        firstChild: new ActivatedRouteSnapshot,
        children: [],
        pathFromRoot: []
      } as any,
      data: of({ content: { data: mockTestData } }),
    }

    mockAccessControlService = {
      authoringConfig: {
        newDesign: false,
      },
    } as any

    mockViewerUtilService = {
      getContent: jasmine.createSpy().and.returnValue(of(mockTestData)),
    } as any

    mockEventService = {
      dispatchEvent: jasmine.createSpy(),
    } as any

    mockLoggerService = {
      error: jasmine.createSpy(),
    } as any

    mockMatDialog = {
      open: jasmine.createSpy(),
    } as any

    mockContentService = {}

    mockRouter = { events: EMPTY }

    // Create component instance
    component = new PracticeTestComponent(
      mockMatDialog,
      mockActivatedRoute as ActivatedRoute,
      mockAccessControlService,
      mockViewerUtilService,
      mockEventService,
      mockContentService,
      mockLoggerService,
      mockRouter
    )

  })

  describe('initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy()
    })

    it('should initialize with default values', () => {
      expect(component.isPreviewMode).toBeFalsy()
      expect(component.isFetchingDataComplete).toBeFalsy()
      expect(component.testData).toBeNull()
      // batchId is now properly initialized from queryParamMap
      expect(component.batchId).toBe('test-batch')
    })

    it('should initialize quiz JSON with default values', () => {
      expect(component.quizJson).toEqual({
        timeLimit: 300,
        questions: [],
        isAssessment: false,
        allowSkip: 'No',
        maxQuestions: 0,
        requiresSubmit: 'Yes',
        showTimer: 'Yes',
      })
    })
  })

  describe('ngOnInit', () => {
    it('should handle preview mode initialization', () => {
      // Set preview mode query param
      const previewRoute = {
        ...mockActivatedRoute,
        snapshot: {
          ...mockActivatedRoute.snapshot,
          queryParamMap: convertToParamMap({ preview: 'true' })
        }
      }

      component = new PracticeTestComponent(
        mockMatDialog,
        previewRoute as ActivatedRoute,
        mockAccessControlService,
        mockViewerUtilService,
        mockEventService,
        mockContentService,
        mockLoggerService,
        mockRouter
      )

      component.ngOnInit()
      expect(component.isPreviewMode).toBeTruthy()
      expect(mockViewerUtilService.getContent).toHaveBeenCalledWith('test-resource')
    })

    it('should handle normal mode initialization', () => {
      component.ngOnInit()
      expect(component.isPreviewMode).toBeTruthy()
      expect(component.testData).toEqual(mockTestData)
    })
  })

  describe('init', () => {
    it('should initialize quiz data from test data', () => {
      component.testData = mockTestData
      component.init()

      expect(component.quizJson.maxQuestions).toBe(mockTestData.maxQuestions)
      expect(component.quizJson.allowSkip).toBe(mockTestData.allowSkip)
      expect(component.quizJson.requiresSubmit).toBe(mockTestData.requiresSubmit)
      expect(component.quizJson.timeLimit).toBe(mockTestData.expectedDuration)
    })

    it('should set fetchingDataComplete after timeout', fakeAsync(() => {
      component.testData = mockTestData
      component.init()

      tick(100)

      expect(component.isFetchingDataComplete).toBeTruthy()
    }))
  })



  describe('ngOnDestroy', () => {
    it('should raise unload event if test data exists', () => {
      component.testData = mockTestData
      component.ngOnDestroy()

      expect(mockEventService.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            state: WsEvents.EnumTelemetrySubType.Unloaded,
          }),
        })
      )
    })

    it('should unsubscribe from all subscriptions', () => {
      const mockSubscription = {
        unsubscribe: jasmine.createSpy(),
      }

      component['dataSubscription'] = mockSubscription as any
      component['viewerDataSubscription'] = mockSubscription as any
      component['telemetryIntervalSubscription'] = mockSubscription as any

      component.ngOnDestroy()

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(3)
    })
  })
})