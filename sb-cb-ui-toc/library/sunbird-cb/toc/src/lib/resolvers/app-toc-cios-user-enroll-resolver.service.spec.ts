import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'

import { AppTocCiosUserEnrollResolverService } from './app-toc-cios-user-enroll-resolver.service'
import { WidgetContentService } from '../_services/widget-content.service'

describe('AppTocCiosUserEnrollResolverService', () => {
  const contentSvcMock = { fetchExtUserContentEnroll: jest.fn() }

  beforeEach(() => {
    contentSvcMock.fetchExtUserContentEnroll.mockReset()
    TestBed.configureTestingModule({
      providers: [
        { provide: WidgetContentService, useValue: contentSvcMock },
      ],
    })
  })

  it('should be created', () => {
    const service: AppTocCiosUserEnrollResolverService = TestBed.inject(AppTocCiosUserEnrollResolverService)
    expect(service).toBeTruthy()
  })

  it('should resolve enrollment data for the route id', done => {
    contentSvcMock.fetchExtUserContentEnroll.mockReturnValue(of({ enrolled: true }))
    const service: AppTocCiosUserEnrollResolverService = TestBed.inject(AppTocCiosUserEnrollResolverService)
    service.resolve({ params: { id: 'do_123' } } as any, {} as any).subscribe(result => {
      expect(contentSvcMock.fetchExtUserContentEnroll).toHaveBeenCalledWith('do_123')
      expect(result).toEqual({ data: { enrolled: true }, error: null })
      done()
    })
  })

  it('should resolve an error when the request fails', done => {
    contentSvcMock.fetchExtUserContentEnroll.mockReturnValue(throwError('failed'))
    const service: AppTocCiosUserEnrollResolverService = TestBed.inject(AppTocCiosUserEnrollResolverService)
    service.resolve({ params: {} } as any, {} as any).subscribe(result => {
      expect(contentSvcMock.fetchExtUserContentEnroll).toHaveBeenCalledWith('')
      expect(result).toEqual({ error: 'failed', data: null })
      done()
    })
  })
})
