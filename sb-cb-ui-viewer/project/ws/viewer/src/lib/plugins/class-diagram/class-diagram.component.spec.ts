import { ClassDiagramComponent } from './class-diagram.component'
import { DomSanitizer } from '@angular/platform-browser'
import { ClassDiagramService } from './class-diagram.service'
import { ElementRef, Renderer2 } from '@angular/core'
import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { jsPlumb } from 'jsplumb'

const createJsPlumbInstance = () => ({
  registerConnectionType: jasmine.createSpy(),
  draggable: jasmine.createSpy(),
  batch: jasmine.createSpy(),
  bind: jasmine.createSpy(),
  select: jasmine.createSpy().and.callFake(() => ({
    each: jasmine.createSpy(),
    delete: jasmine.createSpy(),
  })),
  deleteEveryConnection: jasmine.createSpy(),
  makeSource: jasmine.createSpy(),
  makeTarget: jasmine.createSpy(),
  deleteConnection: jasmine.createSpy(),
})

describe('ClassDiagramComponent', () => {
  let component: ClassDiagramComponent
  let mockDomSanitizer: jasmine.SpyObj<DomSanitizer>
  let mockRenderer: jasmine.SpyObj<Renderer2>
  let mockClassDiagramService: jasmine.SpyObj<ClassDiagramService>
  let mockElementRef: ElementRef

  const mockClassDiagram = {
    problemStatement: '<p>Create a class diagram</p>',
    timeLimit: 30,
    options: {
      classes: [
        { name: 'Class1', type: 'class' },
        { name: 'Class2', type: 'class' },
      ],
    },
  }

  beforeEach(() => {
    spyOn(jsPlumb, 'getInstance').and.callFake(() => createJsPlumbInstance() as any)

    mockDomSanitizer = {
      bypassSecurityTrustHtml: jasmine.createSpy().and.callFake(html => html),
    } as any

    mockRenderer = {
      listen: jasmine.createSpy(),
      createElement: jasmine.createSpy(),
      appendChild: jasmine.createSpy(),
    } as any

    mockClassDiagramService = {
      submitClassDiagram: jasmine.createSpy(),
    } as any

    mockElementRef = {
      nativeElement: document.createElement('div'),
    }

    component = new ClassDiagramComponent(
      mockDomSanitizer,
      mockRenderer,
      mockClassDiagramService
    )

    component.classDiagramContainer = mockElementRef
    component.classDiagram = mockClassDiagram
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit()
    })

    it('should set up event listeners', () => {
      expect(mockRenderer.listen).toHaveBeenCalledTimes(3)
      expect(mockRenderer.listen).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'dragover',
        jasmine.any(Function)
      )
      expect(mockRenderer.listen).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'drop',
        jasmine.any(Function)
      )
      expect(mockRenderer.listen).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'click',
        jasmine.any(Function)
      )
    })
  })

  describe('initializeClassDiagram', () => {
    // ngOnChanges starts the countdown interval, so it has to run inside the fake zone
    it('should initialize class diagram data', fakeAsync(() => {
      component.ngOnChanges()
      expect(component.clsDiagramData).toBeDefined()
      expect(component.clsDiagramData?.timeLimit).toBe(30000)
      expect(component.classOptions.length).toBe(2)
      discardPeriodicTasks()
    }))

    it('should submit when timer expires', fakeAsync(() => {
      mockClassDiagramService.submitClassDiagram.and.returnValue(of(null as any))
      const submitSpy = spyOn(component, 'submit').and.callThrough()
      component.ngOnChanges()
      tick(31000)
      expect(submitSpy).toHaveBeenCalled()
      discardPeriodicTasks()
    }))
  })



  describe('submission handling', () => {
    beforeEach(() => {
      // Mock DOM elements and jsPlumb instance
      spyOn(document, 'getElementsByClassName').and.returnValue([{
        getElementsByClassName: jasmine.createSpy().and.returnValue([{
          getAttribute: jasmine.createSpy().and.returnValue('1'),
          classList: { length: 1 },
        }]),
      }] as any)
    })

    it('should handle successful submission', () => {

      mockClassDiagramService.submitClassDiagram.and.returnValue(of())

      component.submit()

      expect(component.isSubmitted).toBeTruthy()
      expect(component.result).toBeNull
      expect(component.error).toBeFalsy()
    })

    it('should handle submission error', () => {
      mockClassDiagramService.submitClassDiagram.and.returnValue(throwError('Error'))

      component.submit()

      expect(component.error).toBeTruthy()
      expect(component.isDisabled).toBeFalsy()
    })
  })

  describe('reset', () => {
    beforeEach(() => {
      component.reset()
    })

    it('should reset component state', () => {
      expect(component.selectedAccess).toBe('public')
      expect(component.selectedRelation).toBe('is-a')
      expect(component.userOptions.classes).toEqual([])
      expect(component.userOptions.relations).toEqual([])
      expect(component.result).toBeNull()
      expect(component.isSubmitted).toBeFalsy()
      expect(component.isDisabled).toBeFalsy()
      expect(component.error).toBeFalsy()
    })
  })

  describe('drag and drop handling', () => {
    it('should handle drag event', () => {
      const mockEvent = {
        dataTransfer: {
          setData: jasmine.createSpy(),
        },
        target: {
          textContent: 'TestClass',
        },
      }

      component.drag(mockEvent)

      expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text', 'TestClass')
    })

    it('should handle drop event for class name', () => {
      const mockEvent = {
        dataTransfer: {
          getData: jasmine.createSpy().and.returnValue('testclass'),
        },
        target: {
          id: 'cls1',
        },
        preventDefault: jasmine.createSpy(),
      }

      spyOn(document, 'getElementById').and.returnValue({
        innerHTML: '',
      } as any)

      component.drop(mockEvent)

      expect(document.getElementById).toHaveBeenCalledWith('cls1')
    })
  })

})