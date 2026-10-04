import { DomSanitizer } from '@angular/platform-browser'
import { PipeSafeSanitizerPipe } from './pipe-safe-sanitizer.pipe'

describe('PipeSafeSanitizerPipe', () => {
  it('create an instance', () => {
    const sanitizer = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustHtml'])
    const pipe = new PipeSafeSanitizerPipe(sanitizer)
    expect(pipe).toBeTruthy()
  })
})
