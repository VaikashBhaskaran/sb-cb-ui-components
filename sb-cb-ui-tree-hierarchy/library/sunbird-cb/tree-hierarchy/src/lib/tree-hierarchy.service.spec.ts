import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TreeHierarchyService } from './tree-hierarchy.service';

describe('TreeHierarchyService', () => {
  let service: TreeHierarchyService;
  let httpMock: HttpTestingController;
  const frameworkObj = { id: 'fw1', category: 'cat1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TreeHierarchyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('orgSerachApi should POST to org search', () => {
    service.orgSerachApi({}).subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/org/v1/search');
    expect(call.request.method).toBe('POST');
    call.flush({});
  });

  it('createTerm should POST with framework and category params', () => {
    service.createTerm({}, frameworkObj).subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/action/framework/v3/term/create?framework=fw1&category=cat1');
    expect(call.request.method).toBe('POST');
    call.flush({});
  });

  it('updateFrameworkAssociation should PATCH the term update url', () => {
    service.updateFrameworkAssociation({}, frameworkObj, 'code1').subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/term/update/code1?framework=fw1&category=cat1');
    expect(call.request.method).toBe('PATCH');
    call.flush({});
  });

  it('publishFreamework should POST to publish with the framework id', () => {
    service.publishFreamework(frameworkObj).subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/publish/fw1');
    expect(call.request.method).toBe('POST');
    call.flush({});
  });

  it('updateCategory should PATCH the category update url', () => {
    service.updateCategory({}, frameworkObj).subscribe();
    const call = httpMock.expectOne('/apis/proxies/v8/framework/v1/category/update/cat1?framework=fw1');
    expect(call.request.method).toBe('PATCH');
    call.flush({});
  });

  it('setLoaderState should emit on loaderState$', () => {
    let state: boolean | undefined;
    service.loaderState$.subscribe(s => state = s);
    service.setLoaderState(true);
    expect(state).toBeTrue();
  });
});
