import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { NotificationsService } from './notifications.service'

describe('NotificationsService', () => {
  let service: NotificationsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: 'environment', useValue: {} }],
    })
    service = TestBed.inject(NotificationsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
