import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ApproveViewComponent } from './approve-view.component';
import { ApprovalService } from '../../services/approval.service';
import { FrameworkService } from '../../services/framework.service';
import * as API from '../../constants/app-constant';

describe('ApproveViewComponent', () => {
  let component: ApproveViewComponent;
  let fixture: ComponentFixture<ApproveViewComponent>;
  let approvalServiceSpy: jasmine.SpyObj<ApprovalService>;
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const workflowResponse = {
    result: {
      currentStatus: 'SEND_FOR_REVIEW_L1',
      updateFieldValues: [{ identifier: 't1' }, { identifier: 't2' }]
    }
  };

  beforeEach(waitForAsync(() => {
    approvalServiceSpy = jasmine.createSpyObj('ApprovalService', ['getWorkflowDetails', 'setApprovalList', 'updateWorkFlowApproval']);
    approvalServiceSpy.getWorkflowDetails.and.returnValue(of(workflowResponse));
    approvalServiceSpy.updateWorkFlowApproval.and.returnValue(of({}));
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['removeOldLine']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [ ApproveViewComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 'wf1' })), snapshot: { params: { id: 'wf1' } } }
        },
        { provide: ApprovalService, useValue: approvalServiceSpy },
        { provide: FrameworkService, useValue: frameworkServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workflow details for the route id on init', () => {
    expect(approvalServiceSpy.getWorkflowDetails).toHaveBeenCalledWith('wf1');
    expect(component.workflowDetails).toEqual(workflowResponse.result);
    expect(component.listItems.length).toBe(2);
    expect(component.listItems.every((i: any) => i.selected === false)).toBeTrue();
    expect(approvalServiceSpy.setApprovalList).toHaveBeenCalledWith(component.listItems);
  });

  it('approvalRequest should send an APPROVE update and show a snackbar', () => {
    component.approvalRequest([]);
    expect(approvalServiceSpy.updateWorkFlowApproval).toHaveBeenCalledWith({
      wfId: 'wf1',
      state: 'SEND_FOR_REVIEW_L1',
      action: API.APPROVAL.APPROVE,
      serviceName: API.APPROVAL.SERVICE_NAME
    });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Terms successfully Approved.', 'cancel');
  });

  it('closeActionBar should hide the action bar', () => {
    component.closeActionBar(null);
    expect(component.showAction).toBeFalse();
  });

  it('should remove old lines on destroy', () => {
    fixture.destroy();
    expect(frameworkServiceSpy.removeOldLine).toHaveBeenCalled();
  });
});
