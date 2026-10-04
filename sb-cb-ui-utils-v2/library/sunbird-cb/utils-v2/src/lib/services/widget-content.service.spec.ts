import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { WidgetContentService } from './widget-content.service'

describe('WidgetContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: WidgetContentService = TestBed.inject(WidgetContentService)
    expect(service).toBeTruthy()
  })
})
