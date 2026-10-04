import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { ContentProgressService } from './content-progress.service'

describe('ContentProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }))

  it('should be created', () => {
    const service: ContentProgressService = TestBed.inject(ContentProgressService)
    expect(service).toBeTruthy()
  })
})
