import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ConfigurationsService } from './configurations.service'

describe('ConfigurationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: ConfigurationsService = TestBed.inject(ConfigurationsService)
    expect(service).toBeTruthy()
  })
})
