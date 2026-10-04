import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OdcsService } from './odcs.service';

describe('OdcsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  it('should be created', () => {
    const service: OdcsService = TestBed.inject(OdcsService);
    expect(service).toBeTruthy();
  });

  it('getDesignations should GET the positions endpoint', () => {
    const service: OdcsService = TestBed.inject(OdcsService);
    const httpMock = TestBed.inject(HttpTestingController);
    let result: any;
    service.getDesignations({}).subscribe(r => result = r);
    const call = httpMock.expectOne('/apis/proxies/v8/user/v1/positions');
    expect(call.request.method).toBe('GET');
    call.flush({ ok: true });
    expect(result).toEqual({ ok: true });
    httpMock.verify();
  });
});
