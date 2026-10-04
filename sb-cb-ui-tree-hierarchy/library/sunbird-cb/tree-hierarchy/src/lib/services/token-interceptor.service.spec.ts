import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { TokenInterceptorService } from './token-interceptor.service';
import { FrameworkService } from './framework.service';

describe('TokenInterceptorService', () => {
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;

  beforeEach(() => {
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['getEnviroment']);
    frameworkServiceSpy.getEnviroment.and.returnValue({});
    TestBed.configureTestingModule({
      providers: [{ provide: FrameworkService, useValue: frameworkServiceSpy }]
    });
  });

  it('should be created', () => {
    const service: TokenInterceptorService = TestBed.inject(TokenInterceptorService);
    expect(service).toBeTruthy();
  });

  it('intercept should pass the request through to the next handler', () => {
    const service: TokenInterceptorService = TestBed.inject(TokenInterceptorService);
    const req = new HttpRequest('GET', '/test');
    const next = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    next.handle.and.returnValue(of({} as any));
    service.intercept(req, next).subscribe();
    expect(frameworkServiceSpy.getEnviroment).toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(req);
  });
});
