import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { RestrictedFeaturesResolverService } from './restricted-features-resolver.service'

describe('RestrictedFeaturesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }))

  it('should be created', () => {
    const service: RestrictedFeaturesResolverService = TestBed.inject(RestrictedFeaturesResolverService)
    expect(service).toBeTruthy()
  })
})
