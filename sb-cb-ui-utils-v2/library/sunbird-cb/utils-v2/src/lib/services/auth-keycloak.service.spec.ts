import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { AuthKeycloakService } from './auth-keycloak.service'

describe('AuthKeycloakService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: AuthKeycloakService = TestBed.inject(AuthKeycloakService)
    expect(service).toBeTruthy()
  })
})
