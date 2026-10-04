import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { SamuhikCharchaService } from './samuhik-charcha.service'

describe('SamuhikCharchaService', () => {
  let service: SamuhikCharchaService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(SamuhikCharchaService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
