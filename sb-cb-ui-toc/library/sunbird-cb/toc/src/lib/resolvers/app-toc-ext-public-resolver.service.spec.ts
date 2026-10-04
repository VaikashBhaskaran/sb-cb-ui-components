import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { AppTocExtPublicResolverService } from './app-toc-ext-public-resolver.service'

describe('AppTocCiosResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
  }))

  it('should be created', () => {
    const service: AppTocExtPublicResolverService = TestBed.inject(AppTocExtPublicResolverService)
    expect(service).toBeTruthy()
  })
})
