import { ViewContainerRef } from '@angular/core'
import { LoggerService } from '@sunbird-cb/utils'
import { WidgetResolverDirective } from './widget-resolver.directive'
import { WidgetResolverService } from './widget-resolver.service'

describe('WidgetResolverDirective', () => {
  let viewContainerRef: ViewContainerRef
  let resolverSvc: jasmine.SpyObj<WidgetResolverService>
  let logger: jasmine.SpyObj<LoggerService>
  let directive: WidgetResolverDirective
  const widget = { widgetType: 'card', widgetSubType: 'content', widgetData: {} }

  beforeEach(() => {
    viewContainerRef = {} as ViewContainerRef
    resolverSvc = jasmine.createSpyObj<WidgetResolverService>('WidgetResolverService', ['resolveWidget'])
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['error'])
    directive = new WidgetResolverDirective(viewContainerRef, resolverSvc, logger)
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy()
  })

  it('should log an error and not resolve when the resolver is not initialized', () => {
    resolverSvc.isInitialized = false
    directive.wsResolverWidget = widget
    directive.ngOnChanges()
    expect(logger.error).toHaveBeenCalled()
    expect(resolverSvc.resolveWidget).not.toHaveBeenCalled()
  })

  it('should resolve the widget into its view container and detect changes', () => {
    const compRef: any = { changeDetectorRef: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) }
    resolverSvc.isInitialized = true
    resolverSvc.resolveWidget.and.returnValue(compRef)
    directive.wsResolverWidget = widget
    directive.ngOnChanges()
    expect(resolverSvc.resolveWidget).toHaveBeenCalledWith(widget, viewContainerRef)
    expect(compRef.changeDetectorRef.detectChanges).toHaveBeenCalled()
  })

  it('should do nothing when no widget config is set', () => {
    resolverSvc.isInitialized = true
    directive.wsResolverWidget = null
    directive.ngOnChanges()
    expect(resolverSvc.resolveWidget).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })
})
