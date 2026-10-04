import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { LoggerService } from './logger.service'

describe('LoggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: LoggerService = TestBed.inject(LoggerService)
    expect(service).toBeTruthy()
  })
})
