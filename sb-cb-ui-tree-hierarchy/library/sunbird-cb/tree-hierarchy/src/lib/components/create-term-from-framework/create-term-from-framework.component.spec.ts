import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormArray } from '@angular/forms';
import { of, Subject } from 'rxjs';

import { MaterialModule } from '../../../material.module';
import { FrameworkService } from '../../services/framework.service';
import { ConforamtionPopupComponent } from '../conforamtion-popup/conforamtion-popup.component';
import { CreateTermFromFrameworkComponent } from './create-term-from-framework.component';

describe('CreateTermFromFrameworkComponent', () => {
  let component: CreateTermFromFrameworkComponent;
  let fixture: ComponentFixture<CreateTermFromFrameworkComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateTermFromFrameworkComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let frameworkServiceSpy: any;
  let frameworkRead$: Subject<any>;
  let dialogData: any;

  const kcmConfig = {
    frameworkId: 'kcm',
    config: [{ category: 'competencyarea' }, { category: 'theme' }, { category: 'subtheme' }],
  };

  function kcmFramework() {
    return {
      categories: [
        {
          code: 'competencyarea', identifier: 'kcm_ca', index: 1, name: 'Competency Area',
          terms: [{
            code: 'behavioural', name: 'Behavioural', identifier: 'ca1',
            associations: [{ category: 'theme', refId: 'T1', identifier: 't1', name: 'Theme One' }],
          }],
        },
        {
          code: 'theme', identifier: 'kcm_theme', index: 2, name: 'Theme',
          terms: [{
            code: 't1', identifier: 't1', refId: 'T1', category: 'theme', name: 'Theme One',
            associations: [{ identifier: 's1', refId: 'S1', category: 'subtheme', name: 'Sub One' }],
          }],
        },
      ],
    };
  }

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    frameworkRead$ = new Subject<any>();
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService', [
      'getEnviroment', 'getFrameworkRead', 'getConfigByFrameWorkId',
      'getConfigOfCategoryConfigByFrameWorkId', 'getConfig',
    ]);
    frameworkServiceSpy.getEnviroment.and.returnValue({ kcmFrameworkName: 'kcm' });
    frameworkServiceSpy.getFrameworkRead.and.returnValue(frameworkRead$.asObservable());
    frameworkServiceSpy.getConfigByFrameWorkId.and.returnValue(kcmConfig);
    frameworkServiceSpy.getConfigOfCategoryConfigByFrameWorkId.and.returnValue({});
    frameworkServiceSpy.getConfig.and.returnValue({ labelName: 'Designation' });
    frameworkServiceSpy.selectionList = new Map<string, any>();
    frameworkServiceSpy.list = new Map<string, any>();
    dialogData = {
      mode: 'multi-create',
      openMode: 'create',
      frameworkId: 'fw1',
      columnInfo: { code: 'theme', name: 'Competency' },
      selectedParentTerms: [{ category: 'designation', name: 'Officer' }],
    };

    TestBed.configureTestingModule({
      declarations: [ CreateTermFromFrameworkComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: FrameworkService, useValue: frameworkServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTermFromFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read the KCM framework and build the competency form on init', () => {
    expect(frameworkServiceSpy.getFrameworkRead).toHaveBeenCalledWith('kcm');
    expect(frameworkServiceSpy.getConfigByFrameWorkId).toHaveBeenCalledWith('kcm');
    expect(component.kcmConfigData).toBe(kcmConfig);
    expect(component.competencyForm.contains('compArea')).toBe(true);
    expect((component.competencyForm.get('compThemeFields') as UntypedFormArray).length).toBe(1);
  });

  it('should render the label of the selected parent terms', () => {
    expect(frameworkServiceSpy.getConfig).toHaveBeenCalledWith('designation');
    expect(fixture.nativeElement.textContent).toContain('Designation');
  });

  it('should map KCM categories and pick the competency area once the framework is read', () => {
    frameworkRead$.next(kcmFramework());
    expect(component.kcmList.size).toBe(2);
    expect(component.competencyArea.code).toBe('competencyarea');
    expect(component.competencyArea.children[0].children.length).toBe(1);
  });

  it('should show an error when reading the KCM framework fails', () => {
    frameworkRead$.error('fail');
    expect(snackBarSpy.open).toHaveBeenCalledWith('KCM Framework read failed.');
  });

  it('should select the competency area of the selected competency parent term', () => {
    dialogData.selectedParentTerms.push({
      category: 'competency', refId: 'T1', children: [],
      additionalProperties: { competencyArea: { code: 'behavioural', name: 'Behavioural' } },
    });
    frameworkRead$.next(kcmFramework());
    expect(component.seletedCompetencyArea).toEqual({ code: 'behavioural', name: 'Behavioural' });
    expect(component.allCompetencyTheme.map((t: any) => t.identifier)).toEqual(['t1']);
  });

  describe('after the KCM framework is loaded', () => {
    beforeEach(() => {
      frameworkRead$.next(kcmFramework());
      fixture.detectChanges();
    });

    it('should list themes that have sub themes when an area is selected', () => {
      const area = component.competencyArea.children[0];
      component.onSelectionArea(area);
      expect(component.seletedCompetencyArea).toBe(area);
      expect(component.competencyForm.get('compArea')!.value).toBe(area);
      expect(component.filteredallCompetencyTheme.map((t: any) => t.identifier)).toEqual(['t1']);
    });

    it('should list sub themes when a theme is selected', () => {
      const optionData: any = {};
      component.OnThemeSelection({ source: { value: { category: 'theme', identifier: 't1' } } }, 0, optionData);
      expect(optionData.children.map((s: any) => s.identifier)).toEqual(['s1']);
      expect(component.filteredallCompetencySubTheme.map((s: any) => s.identifier)).toEqual(['s1']);
    });

    it('should report whether a theme has been chosen', () => {
      expect(component.isThemeSelected).toBe(false);
      (component.competencyForm.get('compThemeFields') as UntypedFormArray).at(0).get('competencyTheme')!.setValue({ name: 'x' });
      expect(component.isThemeSelected).toBe(true);
    });

    it('should switch area directly when no theme has been chosen', () => {
      spyOn(component, 'onSelectionArea');
      const area = component.competencyArea.children[0];
      component.clearSelectedThemes(area);
      expect(component.onSelectionArea).toHaveBeenCalledWith(area);
    });

    it('should ask for confirmation before switching area when a theme has been chosen', () => {
      const dialog = TestBed.inject(MatDialog);
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      component.seletedCompetencyArea = { code: 'previous' };
      (component.competencyForm.get('compThemeFields') as UntypedFormArray).at(0).get('competencyTheme')!.setValue({ name: 'x' });

      component.clearSelectedThemes({ code: 'other' });

      expect(dialog.open).toHaveBeenCalledWith(ConforamtionPopupComponent, jasmine.objectContaining({ disableClose: true }));
      expect(component.competencyForm.get('compArea')!.value).toEqual({ code: 'previous' });
    });

    it('should add and remove competency theme fields in multi-create mode', () => {
      component.addCompetencyTheme();
      expect(component.compThemeFields.length).toBe(2);
      component.removeCompFields(0);
      expect(component.compThemeFields.length).toBe(1);
    });
  });

  it('should build the dialog title from the column and open mode', () => {
    expect(component.getCreateName({ columnInfo: { name: 'Designation' } })).toBe('Create Competency Mapping');
    expect(component.getCreateName({ columnInfo: { name: 'Sub Theme' } })).toBe('Add Competency Sub Theme');
    expect(component.getCreateName({ columnInfo: { name: 'Sub Theme' }, openMode: 'view' })).toBe('View Competency Sub Theme');
    expect(component.getCreateName({ cardColInfo: { name: 'Competency' }, openMode: 'edit' })).toBe('Edit Competency Theme');
    expect(component.getCreateName({ cardColInfo: { name: 'Competency' }, openMode: 'view' })).toBe('View Competency Theme');
    expect(component.getCreateName({ columnInfo: { name: 'Other' } })).toBe('');
  });
});
