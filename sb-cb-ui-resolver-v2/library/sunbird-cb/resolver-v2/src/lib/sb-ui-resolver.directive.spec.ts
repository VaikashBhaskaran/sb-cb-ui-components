import { ViewContainerRef } from '@angular/core'
import { LoggerService } from '@sunbird-cb/utils-v2'
import { SbUiResolverDirective } from './sb-ui-resolver.directive'
import { SbUiResolverService } from './sb-ui-resolver.service'

describe('SbUiResolverDirective', () => {
  let viewContainerRef: ViewContainerRef
  let resolverSvc: jasmine.SpyObj<SbUiResolverService>
  let logger: jasmine.SpyObj<LoggerService>
  let directive: SbUiResolverDirective
  const widget = { widgetType: 'card', widgetSubType: 'content', widgetData: {} }

  beforeEach(() => {
    viewContainerRef = {} as ViewContainerRef
    resolverSvc = jasmine.createSpyObj<SbUiResolverService>('SbUiResolverService', ['resolveWidget'])
    logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['error'])
    directive = new SbUiResolverDirective(viewContainerRef, resolverSvc, logger)
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy()
  })

  it('should log an error and not resolve when the resolver is not initialized', () => {
    resolverSvc.isInitialized = false
    directive.sbUiResolverWidget = widget
    directive.ngOnChanges()
    expect(logger.error).toHaveBeenCalled()
    expect(resolverSvc.resolveWidget).not.toHaveBeenCalled()
  })

  it('should resolve the widget into its view container and detect changes', () => {
    const compRef: any = { changeDetectorRef: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) }
    resolverSvc.isInitialized = true
    resolverSvc.resolveWidget.and.returnValue(compRef)
    directive.sbUiResolverWidget = widget
    directive.ngOnChanges()
    expect(resolverSvc.resolveWidget).toHaveBeenCalledWith(widget, viewContainerRef)
    expect(compRef.changeDetectorRef.detectChanges).toHaveBeenCalled()
  })

  it('should do nothing when no widget config is set', () => {
    resolverSvc.isInitialized = true
    directive.sbUiResolverWidget = null
    directive.ngOnChanges()
    expect(resolverSvc.resolveWidget).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })
})
