import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { AuthMicrosoftService } from './auth-microsoft.service'

describe('AuthMicrosoftService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: AuthMicrosoftService = TestBed.inject(AuthMicrosoftService)
    expect(service).toBeTruthy()
  })
})
