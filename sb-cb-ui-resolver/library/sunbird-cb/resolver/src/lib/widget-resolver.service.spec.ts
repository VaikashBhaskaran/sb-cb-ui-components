import { Component, ViewContainerRef } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { WidgetResolverService } from './widget-resolver.service'
import { WIDGET_RESOLVER_GLOBAL_CONFIG, WIDGET_RESOLVER_SCOPED_CONFIG } from './widget-resolver.constant'
import { RestrictedComponent } from './restricted/restricted.component'
import { UnresolvedComponent } from './unresolved/unresolved.component'
import { InvalidPermissionComponent } from './invalid-permission/invalid-permission.component'

@Component({ selector: 'sb-ui-test-widget', template: '', standalone: false })
class TestWidgetComponent {
  widgetData: any
}

describe('WidgetResolverService', () => {
  let service: WidgetResolverService
  let containerRef: jasmine.SpyObj<ViewContainerRef>
  let createdWith: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestWidgetComponent],
      providers: [
        { provide: WIDGET_RESOLVER_GLOBAL_CONFIG, useValue: [{ widgetType: 'card', widgetSubType: 'content', component: TestWidgetComponent }] },
        { provide: WIDGET_RESOLVER_SCOPED_CONFIG, useValue: [{ widgetType: 'card', widgetSubType: 'blocked', component: TestWidgetComponent }] },
      ],
    })
    service = TestBed.inject(WidgetResolverService)
    containerRef = jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', ['clear', 'createComponent'])
    containerRef.createComponent.and.callFake((factory: any) => {
      createdWith = factory.componentType
      return { instance: {} } as any
    })
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
    expect(service.isInitialized).toBe(false)
  })

  it('should build widget keys from type and sub type', () => {
    expect(WidgetResolverService.getWidgetKey({ widgetType: 'card', widgetSubType: 'content' }))
      .toBe('widget:card::content')
  })

  it('should resolve a registered widget to its component and pass widget data', () => {
    service.initialize(null, null, null, null)
    const compRef = service.resolveWidget({ widgetType: 'card', widgetSubType: 'content', widgetData: { a: 1 } }, containerRef)
    expect(service.isInitialized).toBe(true)
    expect(containerRef.clear).toHaveBeenCalled()
    expect(createdWith).toBe(TestWidgetComponent)
    expect(compRef && compRef.instance.widgetData).toEqual({ a: 1 })
  })

  it('should resolve restricted widget keys to the restricted component', () => {
    service.initialize(new Set(['widget:card::blocked']), null, null, null)
    service.resolveWidget({ widgetType: 'card', widgetSubType: 'blocked', widgetData: {} }, containerRef)
    expect(createdWith).toBe(RestrictedComponent)
  })

  it('should resolve unknown widgets to the unresolved component', () => {
    service.initialize(null, null, null, null)
    service.resolveWidget({ widgetType: 'card', widgetSubType: 'missing', widgetData: {} }, containerRef)
    expect(createdWith).toBe(UnresolvedComponent)
  })

  it('should resolve widgets the user lacks roles for to the invalid permission component', () => {
    service.initialize(null, new Set(['public']), null, null)
    service.resolveWidget(
      { widgetType: 'card', widgetSubType: 'content', widgetData: {}, widgetPermission: { all: ['admin'] } } as any,
      containerRef,
    )
    expect(createdWith).toBe(InvalidPermissionComponent)
  })
})
