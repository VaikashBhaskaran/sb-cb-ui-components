import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { MaterialModule } from '../../../material.module';
import { FrameworkService } from '../../services/framework.service';
import { OdcsService } from '../../services/odcs.service';
import { CreateTermComponent } from './create-term.component';

describe('CreateTermComponent', () => {
  let component: CreateTermComponent;
  let fixture: ComponentFixture<CreateTermComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateTermComponent>>;
  let frameworkServiceSpy: any;
  let odcsServiceSpy: jasmine.SpyObj<OdcsService>;
  let dialogData: any;

  const kcmList = [{ id: 'k1', title: 'Leadership' }, { id: 'k2', title: 'Ethics' }];

  function setup(data: any) {
    dialogData = data;
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: dialogData });
    fixture = TestBed.createComponent(CreateTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function buildData(mode: string) {
    return {
      mode,
      name: 'Theme',
      frameworkId: 'FW1',
      columnInfo: {
        code: 'theme',
        name: 'Theme',
        children: [{ name: 'Existing Theme' }, { name: 'Another' }],
        config: { labelName: 'Theme' },
      },
    };
  }

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService',
      ['getKcmSearchList', 'getPreviousCategory', 'getUuid', 'createTerm', 'updateTerm', 'publishFramework']);
    frameworkServiceSpy.getKcmSearchList.and.returnValue(of({ data: kcmList }));
    frameworkServiceSpy.selectionList = new Map<string, any>();
    frameworkServiceSpy.list = new Map<string, any>();
    odcsServiceSpy = jasmine.createSpyObj('OdcsService', ['getDesignations']);
    TestBed.configureTestingModule({
      declarations: [ CreateTermComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: FrameworkService, useValue: frameworkServiceSpy },
        { provide: OdcsService, useValue: odcsServiceSpy },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    })
    .compileComponents();
  }));

  describe('create mode', () => {
    beforeEach(() => {
      setup(buildData('create'));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load the KCM master list for the column category on construction', () => {
      expect(frameworkServiceSpy.getKcmSearchList).toHaveBeenCalledWith(jasmine.any(Object), 'theme');
      expect(component.masterList).toEqual(kcmList);
      expect(component.filteredMasterList).toEqual(kcmList);
    });

    it('should initialise terms and forms from the dialog data', () => {
      expect(component.termLists).toEqual(dialogData.columnInfo.children);
      expect(component.compLabeltext).toBe('Theme');
      expect(component.createThemeForm.contains('name')).toBe(true);
      expect(component.createThemeForm.get('dname')!.disabled).toBe(true);
      expect(component.themeFields.length).toBe(1);
      expect(component.disableCreate).toBe(false);
    });

    it('should filter existing terms by name ignoring case and spaces', (done) => {
      component.filtedTermLists.subscribe((terms: any[]) => {
        if (component.createTermForm.get('name').value === 'existing t') {
          expect(terms).toEqual([{ name: 'Existing Theme' }]);
          done();
        }
      });
      component.createTermForm.get('name').setValue('existing t');
    });

    it('should flag an existing term on save instead of creating it', () => {
      component.createTermForm.get('name').setValue('Another');
      component.saveTerm();
      expect(component.isTermExist).toBe(true);
      expect(frameworkServiceSpy.createTerm).not.toHaveBeenCalled();
    });

    it('should filter master list values by title', () => {
      expect(component.filterOrgValues('lead', kcmList)).toEqual([kcmList[0]]);
    });

    it('should not add or remove theme fields outside multi-create mode', () => {
      component.addThemeFields();
      expect(component.themeFields.length).toBe(1);
      component.removeThemeFields(0);
      expect(component.themeFields.length).toBe(1);
    });

    it('should patch the display name from the selected option on change', () => {
      component.change({ source: { value: { title: 'Leadership' } } }, component.createThemeForm);
      expect(component.createThemeForm.get('dname')!.value).toBe('Leadership');
      expect(component.expansionTitle).toBe('Leadership');
    });

    it('should close the dialog on cancel', () => {
      component.cancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('multi-create mode', () => {
    beforeEach(() => {
      setup(buildData('multi-create'));
    });

    it('should add and remove theme fields', () => {
      component.addThemeFields();
      expect(component.themeFields.length).toBe(2);
      component.removeThemeFields(0);
      expect(component.themeFields.length).toBe(1);
    });
  });

  describe('view mode', () => {
    beforeEach(() => {
      const data: any = buildData('view');
      data.childrenData = { name: 'Leadership', refId: 'k1', description: 'desc', additionalProperties: { displayName: 'Lead' } };
      setup(data);
    });

    it('should populate the form from the term and disable creation', () => {
      expect(component.disableCreate).toBe(true);
      expect(component.createThemeForm.get('dname')!.value).toBe('Lead');
      expect(component.createThemeForm.get('description')!.value).toBe('desc');
      expect(component.createThemeForm.get('name')!.value).toEqual(kcmList[0]);
    });
  });

  describe('label helpers', () => {
    beforeEach(() => {
      setup(buildData('create'));
    });

    it('should build the create name', () => {
      expect(component.getCreateName('Theme')).toBe('Add Competency Theme');
      expect(component.getCreateName('Sub Theme')).toBe('Add Competency Sub Theme');
      expect(component.getCreateName('Designation')).toBe('Add Designation');
    });

    it('should build the label name', () => {
      expect(component.getLabelName('Theme')).toBe('Competency Theme name');
      expect(component.getLabelName('Other')).toBe('Other');
    });

    it('should map category codes to display names and remember the previous term', () => {
      expect(component.getCategoryName('competencyarea', { code: 'c1' })).toBe('Competency Area');
      expect(component.getCategoryName('theme', { code: 'c2' })).toBe('Competency Theme');
      expect(component.getCategoryName('subtheme', { code: 'c3' })).toBe('Competency Sub Theme');
      expect(component.getCategoryName('other', { code: 'c4' })).toBe('other');
      expect(component.previousCategoryCode).toBe('other');
      expect(component.previousTermCode).toBe('c4');
    });

    it('should return the expansion title from the selected name', () => {
      component.createThemeForm.get('name')!.setValue({ title: 'Ethics' });
      expect(component.getExpansionTitle(component.createThemeForm)).toBe('Ethics');
    });
  });
});
