import { BreakpointObserver } from '@angular/cdk/layout'
import { of } from 'rxjs'
import { ImageResponsiveDirective } from './image-responsive.directive'

describe('ImageResponsiveDirective', () => {
  it('should create an instance', () => {
    const breakpointObserver = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe', 'isMatched'])
    breakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }))
    const directive = new ImageResponsiveDirective(breakpointObserver)
    expect(directive).toBeTruthy()
  })
})
