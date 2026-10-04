import { ViewContainerRef } from '@angular/core'
import { AppTocHomeDirective } from './app-toc-home.directive'

describe('AppTocHomeDirective', () => {
  it('should create an instance', () => {
    const viewContainerRef = {} as ViewContainerRef
    const directive = new AppTocHomeDirective(viewContainerRef)
    expect(directive).toBeTruthy()
    expect(directive.viewContainerRef).toBe(viewContainerRef)
  })
})
