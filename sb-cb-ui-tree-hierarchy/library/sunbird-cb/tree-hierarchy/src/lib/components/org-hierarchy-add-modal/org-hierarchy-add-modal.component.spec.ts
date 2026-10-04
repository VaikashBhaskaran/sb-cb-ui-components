import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../material.module';
import { FrameworkService } from '../../services/framework.service';
import { OrgHierarchyAddModalComponent } from './org-hierarchy-add-modal.component';

describe('OrgHierarchyAddModalComponent', () => {
  let component: OrgHierarchyAddModalComponent;
  let fixture: ComponentFixture<OrgHierarchyAddModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<OrgHierarchyAddModalComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let frameworkServiceMock: any;
  let dialogData: any;

  const orgs = [
    { identifier: 'o1', orgName: 'Beta Org' },
    { identifier: 'o2', orgName: 'Alpha Org' },
    { identifier: 'o3', orgName: 'Gamma Org' },
  ];

  function setup(data: any) {
    dialogData = data;
    TestBed.configureTestingModule({
      declarations: [OrgHierarchyAddModalComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: FrameworkService, useValue: frameworkServiceMock },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ]
    });
    fixture = TestBed.createComponent(OrgHierarchyAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    frameworkServiceMock = {
      additionalData: orgs,
      completeResponse: {
        categories: [
          { code: 'ministry', terms: [{ code: 'm1', name: 'Ministry One', additionalProperties: { orgId: 'o3' } }] },
          { code: 'department', terms: [] },
        ],
      },
    };
  });

  describe('add mode', () => {
    beforeEach(() => {
      setup({
        type: 'add',
        previous: [{ category: 'ministry', code: 'm1', name: 'Ministry One' }],
        currentData: { code: 'department' },
      });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should offer only organisations not already in the framework', () => {
      expect(component.orgOptions.map(o => o.identifier)).toEqual(['o1', 'o2']);
      expect(component.filteredOptions.length).toBe(2);
    });

    it('should filter options by name and keep selected items first', () => {
      component.selectedOrgsControl.setValue(['o1']);
      component.filterOptions('alpha');
      expect(component.filteredOptions.map(o => o.identifier)).toEqual(['o1', 'o2']);
    });

    it('should reset filtered options when the search is empty', () => {
      component.filteredOptions = [];
      component.filterOptions('');
      expect(component.filteredOptions.length).toBe(2);
    });

    it('should toggle select all', () => {
      const event = new Event('click');
      component.toggleSelectAll(event);
      expect(component.selectedOrgsControl.value).toEqual(['o1', 'o2']);
      expect(component.isAllSelected()).toBe(true);
      component.toggleSelectAll(event);
      expect(component.selectedOrgsControl.value).toEqual([]);
      expect(component.isAllSelected()).toBe(false);
    });

    it('should remove a selected org', () => {
      component.selectedOrgsControl.setValue(['o1', 'o2']);
      component.removeOrg('o1');
      expect(component.selectedOrgsControl.value).toEqual(['o2']);
      component.removeSelected('o2');
      expect(component.selectedOrgsControl.value).toEqual([]);
    });

    it('should return the org name for an id', () => {
      expect(component.getNameOfOrg('o2')).toBe('Alpha Org');
      expect(component.getNameOfOrg('unknown')).toBe('');
    });

    it('should block enter key in handlers', () => {
      const enter = new KeyboardEvent('keydown', { key: 'Enter' });
      expect(component.handleKeydown(enter)).toBe(false);
      expect(component.handleSearchKeydown(enter)).toBe(false);
      expect(component.handleKeydown(new KeyboardEvent('keydown', { key: 'a' }))).toBe(true);
    });

    it('should warn and not close when saving with no organisation selected', () => {
      component.onSave();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Please select at least one organization');
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close with the selected organisations on save', () => {
      component.selectedOrgsControl.setValue(['o2']);
      component.onSave();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        selectedOrg: [orgs[1]],
        paparentSelectedOrg: undefined,
        currentTerm: dialogData.previous[0],
        type: 'add',
      });
    });

    it('should close the dialog on close', () => {
      component.onClose();
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('update mode', () => {
    beforeEach(() => {
      setup({
        type: 'update',
        previous: [
          { category: 'ministry', code: 'm1', name: 'Ministry One' },
          { category: 'department', code: 'd1', name: 'Dept One' },
        ],
      });
    });

    it('should load parent terms from the previous category', () => {
      expect(component.parentFilteredOptions).toEqual(frameworkServiceMock.completeResponse.categories[0].terms);
    });

    it('should filter parent options by name', () => {
      component.filterParentOptions('none');
      expect(component.parentFilteredOptions).toEqual([]);
      component.filterParentOptions('');
      expect(component.parentFilteredOptions.length).toBe(1);
    });

    it('should require an organisation or parent before saving', () => {
      component.onSave();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Please select at least one organization or parent organization');
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should not allow the parent to be selected as a child', () => {
      component.selectedOrgsControl.setValue(['m1']);
      component.parentSelectedOrgControl.setValue('m1');
      component.onSave();
      expect(snackBarSpy.open).toHaveBeenCalledWith('You cannot select the parent organization as a child organization');
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close with the selected parent on save', () => {
      component.parentSelectedOrgControl.setValue('m1');
      component.onSave();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        selectedOrg: [],
        paparentSelectedOrg: frameworkServiceMock.completeResponse.categories[0].terms[0],
        currentTerm: dialogData.previous[1],
        type: 'update',
      });
    });
  });
});
