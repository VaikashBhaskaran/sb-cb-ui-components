import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ApprovalService } from '../../services/approval.service';
import { ConnectorService } from '../../services/connector.service';
import { FrameworkService } from '../../services/framework.service';
import { TreeHierarchyService } from '../../tree-hierarchy.service';
import { TreeViewComponent } from './tree-view.component';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;
  let frameworkService: FrameworkService;
  let approvalService: ApprovalService;
  let getFrameworkInfoSpy: jasmine.Spy;

  const boardColumn: any = {
    code: 'board', index: 1, name: 'Board', config: {},
    children: [
      { identifier: 'b1', code: 'b1', name: 'B1', category: 'board' },
      { identifier: 'b2', code: 'b2', name: 'B2', category: 'board', status: 'Retired' },
    ],
  };
  const mediumColumn: any = {
    code: 'medium', index: 2, name: 'Medium', config: {},
    children: [],
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeViewComponent ],
      imports: [ MatDialogModule, MatSnackBarModule ],
      // ConnectorService is not providedIn root; TreeHierarchyModule provides it
      providers: [ provideHttpClient(), provideHttpClientTesting(), ConnectorService ],
      // child components (lib-tree-column-view, lib-action-bar, mat-icon) are covered by their own specs
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    frameworkService = TestBed.inject(FrameworkService);
    approvalService = TestBed.inject(ApprovalService);
    getFrameworkInfoSpy = spyOn(frameworkService, 'getFrameworkInfo').and.returnValue(of({}));
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    frameworkService.list.clear();
    frameworkService.selectionList.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load the framework on init and show the loading message while the list is empty', () => {
    fixture.detectChanges();
    expect(getFrameworkInfoSpy).toHaveBeenCalledWith('', '');
    expect(component.isLoading).toBe(false);
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(component.app_strings.loading);
  });

  it('should pass the selected org data when loading the framework', () => {
    component.orgSelectedData = { id: 'org1' };
    component.childOrgData = { rootOrgId: 'org1' };
    fixture.detectChanges();
    expect(getFrameworkInfoSpy).toHaveBeenCalledWith({ id: 'org1' }, { rootOrgId: 'org1' });
  });

  it('should push the environment and taxonomy config to the framework service', () => {
    component.environment = { frameworkName: 'fw' };
    component.taxonomyConfig = [{ frameworkId: 'fw', config: [] }];
    fixture.detectChanges();
    expect(frameworkService.getEnviroment()).toEqual({ frameworkName: 'fw' });
    expect(frameworkService.rootConfig).toEqual(component.taxonomyConfig);
  });

  it('should show the action bar only for the approval view', () => {
    component.isApprovalView = true;
    fixture.detectChanges();
    expect(component.showActionBar).toBe(true);
  });

  it('should emit loader state changes', () => {
    const emitted: any[] = [];
    component.loaderEnable.subscribe(v => emitted.push(v));
    fixture.detectChanges();
    TestBed.inject(TreeHierarchyService).setLoaderState(true);
    expect(emitted).toEqual([false, true]);
  });

  it('should render a column per framework category', () => {
    frameworkService.list.set('board', boardColumn);
    frameworkService.list.set('medium', mediumColumn);
    fixture.detectChanges();
    expect(component.list.length).toBe(2);
    expect(fixture.nativeElement.querySelector('#box1Container')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#box2Container')).toBeTruthy();
  });

  describe('after init', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should track draft terms and toggle the action bar', () => {
      const term: any = { identifier: 't1' };
      component.updateDraftStatusTerms({ checked: true, term });
      expect(component.draftTerms).toEqual([term]);
      expect(component.showActionBar).toBe(true);
      component.updateDraftStatusTerms({ checked: false, term });
      expect(component.draftTerms).toEqual([]);
      expect(component.showActionBar).toBe(false);
    });

    it('should hide the action bar on close', () => {
      component.showActionBar = true;
      component.closeActionBar(null);
      expect(component.showActionBar).toBe(false);
    });

    it('should record card counts per category', () => {
      component.getNoOfCards({ category: 'board', count: 2 });
      component.getNoOfCards({ category: 'medium', count: 1 });
      expect(component.categoryList).toEqual([{ category: 'board', count: 2 }, { category: 'medium', count: 1 }]);
    });

    it('should count non retired terms for the first column', () => {
      frameworkService.list.set('board', boardColumn);
      expect(component.getCount('board')).toBe(1);
    });

    it('should return 0 for a column whose parent has no selection', () => {
      frameworkService.list.set('board', boardColumn);
      frameworkService.list.set('medium', mediumColumn);
      expect(component.getCount('medium')).toBe(0);
    });

    it('should mark only the selected term in a category', () => {
      const column: any = { code: 'board', children: [{ code: 'b1' }, { code: 'b2' }] };
      frameworkService.list.set('board', column);
      component.updateSelection('board', 'b2');
      expect(column.children.map((c: any) => c.selected)).toEqual([false, true]);
    });

    it('should report whether a column has a selection', () => {
      expect(component.isEnabled('board')).toBe(false);
      frameworkService.selectionList.set('board', { code: 'b1' });
      expect(component.isEnabled('board')).toBe(true);
    });

    it('should enable only the first column when nothing is selected', () => {
      frameworkService.currentSelection.next(null);
      expect(component.isCurrentOrNextTerm({}, 0)).toBe(true);
      expect(component.isCurrentOrNextTerm({}, 1)).toBe(false);
    });

    it('should enable the current and next column for the current selection', () => {
      frameworkService.list.set('board', boardColumn);
      frameworkService.list.set('medium', mediumColumn);
      frameworkService.currentSelection.next({ type: 'board', data: {} });
      expect(component.isCurrentOrNextTerm({}, 0)).toBe(true);
      expect(component.isCurrentOrNextTerm({}, 1)).toBe(true);
      expect(component.isCurrentOrNextTerm({}, 2)).toBe(false);
    });

    it('should emit draft terms for approval in the approval view', () => {
      spyOn(component.sentForApprove, 'emit');
      component.isApprovalView = true;
      component.draftTerms = [{ identifier: 't1' } as any];
      component.sendForApproval();
      expect(component.sentForApprove.emit).toHaveBeenCalledWith([{ identifier: 't1' }]);
    });

    it('should create an approval with the selected and draft terms', () => {
      const snackBar = TestBed.inject(MatSnackBar);
      spyOn(snackBar, 'open');
      spyOn(approvalService, 'createApproval').and.returnValue(of({}));
      const selected = { identifier: 'b1', selected: true };
      frameworkService.list.set('board', { code: 'board', children: [selected, { identifier: 'b2' }] } as any);
      component.draftTerms = [{ identifier: 'd1' } as any];
      component.sendForApproval();
      expect(approvalService.createApproval).toHaveBeenCalledWith({ updateFieldValues: [selected, { identifier: 'd1' }] });
      expect(snackBar.open).toHaveBeenCalledWith('Terms successfully sent for Approval.', 'cancel');
    });

    it('should emit manageOrg for the manage-org card action', () => {
      spyOn(component.manageOrg, 'emit');
      component.cardActionEmit({ action: 'manage-org', data: { children: { code: 'o1' } } });
      expect(component.manageOrg.emit).toHaveBeenCalledWith({ code: 'o1' });
    });

    it('should detect child organisations', () => {
      component.orgSelectedData = { id: 'org1' };
      component.childOrgData = { rootOrgId: 'org1' };
      component.userRolesData = new Set<string>();
      expect(component.checkChildOrg()).toBe(false);
      component.childOrgData = { rootOrgId: 'org2' };
      expect(component.checkChildOrg()).toBe(true);
      component.childOrgData = { rootOrgId: 'org1' };
      component.userRolesData = new Set<string>(['mdo_admin']);
      expect(component.checkChildOrg()).toBe(true);
    });
  });
});
