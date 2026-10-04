import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'

import { AppTocService } from './app-toc.service'

describe('AppTocService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
    ],
  }))

  it('should be created', () => {
    const service: AppTocService = TestBed.inject(AppTocService)
    expect(service).toBeTruthy()
  })
})
