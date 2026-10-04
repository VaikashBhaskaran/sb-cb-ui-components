import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { MaterialModule } from '../../../material.module';
import { ApprovalService } from '../../services/approval.service';
import { FrameworkService } from '../../services/framework.service';
import { TermCardComponent } from './term-card.component';

describe('TermCardComponent', () => {
  let component: TermCardComponent;
  let fixture: ComponentFixture<TermCardComponent>;
  let frameworkService: FrameworkService;
  let approvalService: ApprovalService;

  function buildData(overrides: any = {}) {
    return {
      children: { identifier: 't1', code: 't1', name: 'Term One', category: 'board' },
      selected: false,
      category: 'board',
      cardSubType: 'minimal',
      isViewOnly: false,
      index: 1,
      columnInfo: {
        code: 'board',
        children: [{ code: 't1', userCount: 7 }],
        config: {},
      },
      ...overrides,
    };
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermCardComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [ provideHttpClient(), provideHttpClientTesting() ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const sanitizer = TestBed.inject(DomSanitizer);
    TestBed.inject(MatIconRegistry).addSvgIconLiteral('frac', sanitizer.bypassSecurityTrustHtml('<svg></svg>'));
    frameworkService = TestBed.inject(FrameworkService);
    // getColor() reads the category config; the host app sets this via setConfig()
    frameworkService.frameworkId = 'fw1';
    frameworkService.setConfig([{ frameworkId: 'fw1', config: [{ category: 'board', color: '#abcdef' }] }]);
    approvalService = TestBed.inject(ApprovalService);
    fixture = TestBed.createComponent(TermCardComponent);
    component = fixture.componentInstance;
    component.data = buildData();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the highlight flag when data is set', () => {
    const data = buildData();
    (data.children as any).highlight = true;
    component.data = data;
    expect(component.data.children.highlight).toBe(false);
  });

  it('should highlight the term when it is in the approval list', () => {
    approvalService.setApprovalList([{ identifier: 't1' }]);
    expect(component.approvalList).toEqual(['t1'] as any);
    expect(component.data.children.highlight).toBe(true);
  });

  it('should render the term name and user count', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-title')!.textContent).toContain('Term One');
    expect(el.textContent).toContain('7 Users');
  });

  it('should return the user count of the matching column child', () => {
    expect(component.getuserCount(component.data)).toBe(7);
    expect(component.getuserCount({ children: {} })).toBe(0);
  });

  it('should use the category colour for selected cards and borders', () => {
    const cardRef = document.createElement('div');
    expect(component.getColor(1, cardRef, 'bgColor', component.data)).toBeUndefined();
    cardRef.classList.add('selected', '1');
    expect(component.getColor(1, cardRef, 'bgColor', component.data)).toBe('#abcdef');
    expect(component.getColor(1, cardRef, 'border', component.data)).toBe('8px solid#abcdef');
  });

  it('should emit selectedCard on product click', () => {
    spyOn(component.selectedCard, 'emit');
    const term = { identifier: 't1' };
    component.handleProductClick(term, { checked: true });
    expect(component.selectedCard.emit).toHaveBeenCalledWith({ term, checked: true } as any);
  });

  it('should emit cardAction on menu action', () => {
    spyOn(component.cardAction, 'emit');
    component.menuAction('manage-org', component.data);
    expect(component.cardAction.emit).toHaveBeenCalledWith({ action: 'manage-org', data: component.data });
  });

  it('should publish the selection and emit isSelected when a card is clicked', () => {
    spyOn(frameworkService, 'isLastColumn').and.returnValue(false);
    spyOn(frameworkService.currentSelection, 'next');
    spyOn(component.isSelected, 'emit');
    const cardRef = document.createElement('div');

    component.cardClicked(component.data, cardRef);

    expect(frameworkService.cardClkData).toBe(component.data);
    expect(frameworkService.currentSelection.next).toHaveBeenCalledWith({
      type: 'board', data: component.data.children, cardRef,
    });
    expect(component.isSelected.emit).toHaveBeenCalledWith({ element: component.data.children, isSelected: true } as any);
  });

  it('should not emit isSelected when the card is in the last column', () => {
    spyOn(frameworkService, 'isLastColumn').and.returnValue(true);
    spyOn(component.isSelected, 'emit');
    component.cardClicked(component.data, document.createElement('div'));
    expect(component.isSelected.emit).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const sub = component.subscription;
    fixture.destroy();
    expect(sub.closed).toBe(true);
  });
});
