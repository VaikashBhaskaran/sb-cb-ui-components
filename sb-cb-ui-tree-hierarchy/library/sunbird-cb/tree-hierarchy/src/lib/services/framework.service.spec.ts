import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { FrameworkService } from './framework.service';
import { LocalConnectionService } from './local-connection.service';

describe('FrameworkService', () => {
  let service: FrameworkService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FrameworkService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateEnvironment should be returned by getEnviroment', () => {
    const env = { frameworkName: 'fw' };
    service.updateEnvironment(env);
    expect(service.getEnviroment()).toBe(env);
  });

  it('readTerms should POST to term search and map to result', () => {
    let result: any;
    service.readTerms('fw1', 'cat1', { q: 1 }).subscribe(r => result = r);
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/term/search?framework=fw1&category=cat1');
    expect(call.request.method).toBe('POST');
    call.flush({ result: { terms: [] } });
    expect(result).toEqual({ terms: [] });
  });

  it('publishFramework should POST to publish using the environment framework name', () => {
    service.updateEnvironment({ frameworkName: 'myFw' });
    service.publishFramework().subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/publish/myFw');
    expect(call.request.method).toBe('POST');
    call.flush({});
  });

  it('getFrameworkRead should GET the framework and return result.framework when online', () => {
    const localConfig = TestBed.inject(LocalConnectionService);
    spyOnProperty(localConfig, 'connectionType', 'get').and.returnValue('online');
    let result: any;
    service.getFrameworkRead('fw1').subscribe(r => result = r);
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/read/fw1');
    expect(call.request.method).toBe('GET');
    call.flush({ result: { framework: { code: 'fw1' } } });
    expect(result).toEqual({ code: 'fw1' });
  });

  it('getNextCategory and getPreviousCategory should navigate categoriesHash', () => {
    const cats: any[] = [{ code: 'a' }, { code: 'b' }, { code: 'c' }];
    service.categoriesHash.next(cats);
    expect(service.getNextCategory('a')).toBe(cats[1]);
    expect(service.getNextCategory('c')).toBeNull();
    expect(service.getPreviousCategory('b')).toBe(cats[0]);
    expect(service.getPreviousCategory('a')).toBeNull();
    expect(service.isLastColumn('c')).toBeTrue();
    expect(service.isLastColumn('a')).toBeFalse();
  });

  it('removeItemFromArray should remove the matching item', () => {
    expect(service.removeItemFromArray(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });

  it('getUserCount should return the count for the term org or 0', () => {
    service.userCountData = [{ id: 'org1', count: 5 }];
    expect(service.getUserCount({ additionalProperties: { orgId: 'org1' } })).toBe(5);
    expect(service.getUserCount({ additionalProperties: { orgId: 'org2' } })).toBe(0);
    expect(service.getUserCount({})).toBe(0);
  });

  it('getConfigByFrameWorkId should return the matching root config', () => {
    const cfg = { frameworkId: 'fw1', config: [{ category: 'cat1' }] };
    service.setConfig([cfg]);
    expect(service.getConfigByFrameWorkId('fw1')).toBe(cfg);
    expect(service.getConfigOfCategoryConfigByFrameWorkId('cat1', 'fw1')).toEqual({ category: 'cat1' });
  });
});
