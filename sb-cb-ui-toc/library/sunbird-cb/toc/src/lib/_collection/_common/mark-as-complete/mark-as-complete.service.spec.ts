import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { MarkAsCompleteService } from './mark-as-complete.service'

describe('MarkAsCompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }))

  it('should be created', () => {
    const service: MarkAsCompleteService = TestBed.inject(MarkAsCompleteService)
    expect(service).toBeTruthy()
  })
})
