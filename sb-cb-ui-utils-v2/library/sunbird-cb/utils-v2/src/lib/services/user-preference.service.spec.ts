import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { UserPreferenceService } from './user-preference.service'

describe('UserPreferenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: UserPreferenceService = TestBed.inject(UserPreferenceService)
    expect(service).toBeTruthy()
  })
})
