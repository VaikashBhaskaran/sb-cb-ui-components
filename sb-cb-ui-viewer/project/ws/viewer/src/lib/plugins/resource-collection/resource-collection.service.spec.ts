import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TestBed } from '@angular/core/testing'

import { ResourceCollectionService } from './resource-collection.service'

describe('ResourceCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      { provide: 'environment', useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }))

  it('should be created', () => {
    const service: ResourceCollectionService = TestBed.inject(ResourceCollectionService)
    expect(service).toBeTruthy()
  })
})
