import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TestBed } from '@angular/core/testing'

import { ProfileResolverService } from './profile-resolver.service'

describe('ProfileResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      ProfileResolverService,
      { provide: 'environment', useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }))

  it('should be created', () => {
    const service: ProfileResolverService = TestBed.inject(ProfileResolverService)
    expect(service).toBeTruthy()
  })
})
