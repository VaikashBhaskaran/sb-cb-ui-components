import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { UserAutocompleteService } from './user-autocomplete.service'

describe('UserAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }))

  it('should be created', () => {
    const service: UserAutocompleteService = TestBed.inject(UserAutocompleteService)
    expect(service).toBeTruthy()
  })
})
