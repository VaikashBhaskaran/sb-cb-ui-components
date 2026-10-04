import { TestBed } from '@angular/core/testing'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

import { ProfileResolverService } from './profile-resolver.service'

describe('ProfileResolverService', () => {
  const userProfile = { userId: 'user-1' }

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ConfigurationsService, useValue: { userProfile } },
    ],
  }))

  it('should be created', () => {
    const service: ProfileResolverService = TestBed.inject(ProfileResolverService)
    expect(service).toBeTruthy()
  })

  it('should resolve the current user profile', done => {
    const service: ProfileResolverService = TestBed.inject(ProfileResolverService)
    service.resolve({} as any, {} as any).subscribe(result => {
      expect(result).toEqual({ data: userProfile, error: null })
      done()
    })
  })
})
