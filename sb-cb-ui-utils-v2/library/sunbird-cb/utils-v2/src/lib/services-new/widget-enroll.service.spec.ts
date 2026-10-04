import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { WidgetEnrollService } from './widget-enroll.service';

describe('WidgetEnrollService', () => {
  let service: WidgetEnrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: 'environment', useValue: {} }],
    });
    service = TestBed.inject(WidgetEnrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
