import { ViewerTocComponent } from './viewer-toc.component'
import { of } from 'rxjs'


describe('ViewerTocComponent', () => {
  let component: ViewerTocComponent
  let mockActivatedRoute: any
  let mockDomSanitizer: any
  let mockWidgetContentService: any
  let mockUtilityService: any
  let mockViewerDataService: any
  let mockViewerUtilService: any
  let mockConfigService: any

  beforeEach(() => {
    // Mock services
    mockActivatedRoute = {
      snapshot: { data: {} },
      queryParamMap: of({
        get: (key: string) => {
          const params: { [key: string]: string } = {
            collectionId: 'test-collection',
            collectionType: 'course',
            primaryCategory: 'Course',
            batchId: '1',
            viewMode: 'START'
          }
          return params[key]
        }
      })
    }

    mockDomSanitizer = {
      bypassSecurityTrustResourceUrl: jasmine.createSpy().and.callFake(url => url)
    }

    mockWidgetContentService = {
      fetchContent: jasmine.createSpy().and.returnValue(of({
        result: {
          content: {
            identifier: 'test-content',
            name: 'Test Content',
            children: [],
            mimeType: 'application/vnd.ekstep.content-collection',
            primaryCategory: 'Course'
          }
        }
      })),
      fetchAuthoringContent: jasmine.createSpy().and.returnValue(of({
        identifier: 'test-content',
        name: 'Test Content',
        children: []
      }))
    }

    mockUtilityService = {
      getLeafNodes: jasmine.createSpy().and.returnValue([]),
      getPath: jasmine.createSpy().and.returnValue([])
    }

    mockViewerDataService = {
      changedSubject: of({}),
      resourceId: 'test-resource',
      updateNextPrevResource: jasmine.createSpy(),
      collectionId: 'test-collection'
    }

    mockConfigService = {
      instanceConfig: {
        logos: {
          defaultContent: 'default-logo-url'
        }
      }
    }

    mockViewerUtilService = {}

    // Initialize component
    component = new ViewerTocComponent(
      mockActivatedRoute,
      mockDomSanitizer,
      mockWidgetContentService,
      mockUtilityService,
      mockViewerDataService,
      mockViewerUtilService,
      mockConfigService
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should initialize with default values', async () => {
      await component.ngOnInit()
      expect(component.collectionId).toBe('test-collection')
      expect(component.collectionType).toBe('course')
      expect(component.viewMode).toBe('START')
      expect(component.batchId).toBe('1')
    })

    it('should set default thumbnail from config service', async () => {
      await component.ngOnInit()
      expect(mockDomSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('default-logo-url')
    })
  })

  describe('changeTocMode', () => {
    it('should toggle between FLAT and TREE modes', () => {
      expect(component.tocMode).toBe('TREE')
      component.changeTocMode()
      expect(component.tocMode).toBe('FLAT')
      component.changeTocMode()
      expect(component.tocMode).toBe('TREE')
    })
  })

  describe('minimizenav', () => {
    it('should emit false when minimizenav is called', () => {
      const emitSpy = spyOn(component.hidenav, 'emit').and.callThrough()
      component.minimizenav()
      expect(emitSpy).toHaveBeenCalledWith(false)
    })
  })


  describe('hasNestedChild', () => {
    it('should return true for nodes with children', () => {
      const node = {
        identifier: 'test',
        children: [{ identifier: 'child' }],
      } as any
      expect(component.hasNestedChild(0, node)).toBeTruthy()
    })

    it('should return false for nodes without children', () => {
      const node = {
        identifier: 'test',
        children: null,
      } as any
      expect(component.hasNestedChild(0, node)).toBeFalsy()
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      const subscription = { unsubscribe: jasmine.createSpy() }
      component['paramSubscription'] = subscription as any
      component['viewerDataServiceSubscription'] = subscription as any

      component.ngOnDestroy()

      expect(subscription.unsubscribe).toHaveBeenCalledTimes(2)
    })
  })
})