import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'

import { AppTocCiosResolverService } from './app-toc-cios-resolver.service'
import { WidgetContentService } from '../_services/widget-content.service'

describe('AppTocCiosResolverService', () => {
  let contentSvc: { fetchExternalContent: jest.Mock }

  beforeEach(() => {
    contentSvc = { fetchExternalContent: jest.fn().mockReturnValue(of({ id: 'abc' })) }
    TestBed.configureTestingModule({
      providers: [
        { provide: WidgetContentService, useValue: contentSvc },
      ],
    })
  })

  it('should be created', () => {
    const service: AppTocCiosResolverService = TestBed.inject(AppTocCiosResolverService)
    expect(service).toBeTruthy()
  })

  it('should resolve external content for the route id', done => {
    const service: AppTocCiosResolverService = TestBed.inject(AppTocCiosResolverService)
    service.resolve({ params: { id: 'abc' } } as any, {} as any).subscribe(result => {
      expect(contentSvc.fetchExternalContent).toHaveBeenCalledWith('abc')
      expect(result).toEqual({ data: { id: 'abc' }, error: null })
      done()
    })
  })

  it('should resolve with error when fetch fails', done => {
    contentSvc.fetchExternalContent.mockReturnValue(throwError('err'))
    const service: AppTocCiosResolverService = TestBed.inject(AppTocCiosResolverService)
    service.resolve({ params: {} } as any, {} as any).subscribe(result => {
      expect(contentSvc.fetchExternalContent).toHaveBeenCalledWith('')
      expect(result).toEqual({ error: 'err', data: null })
      done()
    })
  })
})
