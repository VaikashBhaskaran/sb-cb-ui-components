import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { AppTocV2Service } from './app-toc-v2.service'

describe('AppTocV2Service', () => {
  let service: AppTocV2Service

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
  })
    service = TestBed.inject(AppTocV2Service)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
