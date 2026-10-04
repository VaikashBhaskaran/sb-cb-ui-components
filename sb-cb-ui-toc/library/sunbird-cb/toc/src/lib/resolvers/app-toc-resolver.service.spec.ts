import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'

import { AppTocResolverService } from './app-toc-resolver.service'
import { PipeContentRoutePipe } from '../_collection/_common/pipe-content-route/pipe-content-route.pipe'

describe('AppTocResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      PipeContentRoutePipe,
      { provide: 'environment', useValue: {} },
    ],
  }))

  it('should be created', () => {
    const service: AppTocResolverService = TestBed.inject(AppTocResolverService)
    expect(service).toBeTruthy()
  })
})
