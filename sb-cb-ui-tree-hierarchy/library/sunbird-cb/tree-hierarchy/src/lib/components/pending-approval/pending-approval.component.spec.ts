import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApprovalService } from '../../services/approval.service';
import { FrameworkService } from '../../services/framework.service';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import * as API from '../../constants/app-constant';
import { PendingApprovalComponent } from './pending-approval.component';

describe('PendingApprovalComponent', () => {
  let component: PendingApprovalComponent;
  let fixture: ComponentFixture<PendingApprovalComponent>;
  let approvalServiceSpy: jasmine.SpyObj<ApprovalService>;
  let frameworkServiceSpy: jasmine.SpyObj<FrameworkService>;

  const updateFieldValues = JSON.stringify([
    { category: 'board', name: 'CBSE' },
    { category: 'board', name: 'ICSE' },
    { category: 'medium', name: 'English' },
  ]);

  beforeEach(waitForAsync(() => {
    approvalServiceSpy = jasmine.createSpyObj('ApprovalService', ['getApprovalList']);
    approvalServiceSpy.getApprovalList.and.returnValue(of({
      result: { data: [{ wfId: 'wf1', lastUpdatedOn: 1700000000000, updateFieldValues }] },
    }));
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', ['getFrameworkInfo']);
    frameworkServiceSpy.getFrameworkInfo.and.returnValue(of({
      result: { framework: { categories: [{ code: 'board' }, { code: 'medium' }] } },
    }));
    TestBed.configureTestingModule({
      declarations: [ PendingApprovalComponent, OrderByPipe ],
      providers: [
        { provide: ApprovalService, useValue: approvalServiceSpy },
        { provide: FrameworkService, useValue: frameworkServiceSpy },
      ],
      // mat-card / mat-icon / routerLink are presentational only here
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the level 1 approval list and framework categories on init', () => {
    expect(approvalServiceSpy.getApprovalList).toHaveBeenCalledWith({
      applicationStatus: API.APPROVAL.LEVEL1, serviceName: API.APPROVAL.SERVICE_NAME,
    });
    expect(component.approvalList.length).toBe(1);
    expect(component.categories).toEqual(['board', 'medium'] as any);
  });

  it('should group update field values by category', () => {
    expect(component.createApprovalList(updateFieldValues)).toEqual([
      { name: 'board', terms: [], children: [{ category: 'board', name: 'CBSE' }, { category: 'board', name: 'ICSE' }] },
      { name: 'medium', terms: [], children: [{ category: 'medium', name: 'English' }] },
    ]);
  });

  it('should return term names excluding the first one', () => {
    expect(component.getTerms([{ name: 'a' }, { name: 'b' }, { name: 'c' }])).toEqual(['b', 'c']);
  });

  it('should remove duplicates', () => {
    expect(component.removeDuplicates(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });

  it('should render the pending count and grouped categories', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')!.textContent).toContain('(1)');
    const headings = Array.from(el.querySelectorAll('.col h4')).map(h => h.textContent!.trim());
    expect(headings).toEqual(['board', 'medium']);
  });
});
