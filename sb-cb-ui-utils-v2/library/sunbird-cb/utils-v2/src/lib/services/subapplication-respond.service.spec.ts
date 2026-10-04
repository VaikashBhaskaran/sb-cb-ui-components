import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { NPSGridService } from './nps-grid.service'
import { SubapplicationRespondService } from './subapplication-respond.service'

describe('SubapplicationRespondService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [NPSGridService, { provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: SubapplicationRespondService = TestBed.inject(SubapplicationRespondService)
    expect(service).toBeTruthy()
  })
})
