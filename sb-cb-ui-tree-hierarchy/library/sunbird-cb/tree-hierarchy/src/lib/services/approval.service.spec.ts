import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApprovalService } from './approval.service';
import * as API from '../constants/app-constant';

describe('ApprovalService', () => {
  let service: ApprovalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ApprovalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createApproval should POST to the create endpoint with workflow defaults', () => {
    const req: any = { foo: 'bar' };
    service.createApproval(req).subscribe();
    const call = httpMock.expectOne(API.APPROVAL.CREATE);
    expect(call.request.method).toBe('POST');
    expect(call.request.body).toEqual({
      foo: 'bar',
      state: API.APPROVAL.INITIATE,
      action: API.APPROVAL.ACTION,
      serviceName: API.APPROVAL.SERVICE_NAME
    });
    call.flush({});
  });

  it('getApprovalList should POST to the search endpoint', () => {
    service.getApprovalList({ a: 1 }).subscribe();
    const call = httpMock.expectOne(API.APPROVAL.SEARCH);
    expect(call.request.method).toBe('POST');
    call.flush({});
  });

  it('getWorkflowDetails should GET the read endpoint with the id', () => {
    service.getWorkflowDetails('wf1').subscribe();
    const call = httpMock.expectOne(`${API.APPROVAL.READ}/wf1`);
    expect(call.request.method).toBe('GET');
    call.flush({});
  });

  it('updateWorkFlowApproval should PATCH the update endpoint', () => {
    service.updateWorkFlowApproval({ wfId: 'x' }).subscribe();
    const call = httpMock.expectOne(API.APPROVAL.UPDATE);
    expect(call.request.method).toBe('PATCH');
    call.flush({});
  });

  it('removeDuplicates should drop repeated values', () => {
    expect(service.removeDuplicates(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });

  it('setApprovalList should emit through getUpdateList', () => {
    let latest: any;
    service.getUpdateList().subscribe(v => latest = v);
    service.setApprovalList([1, 2]);
    expect(latest).toEqual([1, 2]);
  });
});
