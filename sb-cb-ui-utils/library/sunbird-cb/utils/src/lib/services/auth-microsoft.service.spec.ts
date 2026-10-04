import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'

import { AuthMicrosoftService } from './auth-microsoft.service'

describe('AuthMicrosoftService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }))

  it('should be created', () => {
    const service: AuthMicrosoftService = TestBed.inject(AuthMicrosoftService)
    expect(service).toBeTruthy()
  })
})
