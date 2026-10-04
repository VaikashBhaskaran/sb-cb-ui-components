import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { MaterialModule } from '../../../material.module';
import { FrameworkService } from '../../services/framework.service';
import { ConforamtionPopupComponent } from './conforamtion-popup.component';

describe('ConforamtionPopupComponent', () => {
  let component: ConforamtionPopupComponent;
  let fixture: ComponentFixture<ConforamtionPopupComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConforamtionPopupComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let frameworkServiceSpy: any;
  let dialogData: any;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    frameworkServiceSpy = jasmine.createSpyObj('FrameworkService',
      ['retireMultipleTerm', 'getPreviousCategory', 'updateFrameworkList', 'publishFramework']);
    frameworkServiceSpy.frameworkId = 'fw1';
    frameworkServiceSpy.selectionList = new Map<string, any>();
    frameworkServiceSpy.currentSelection = jasmine.createSpyObj('currentSelection', ['next']);
    dialogData = {
      dialogType: 'warning',
      descriptions: [
        { header: 'Are you sure?', headerClass: '', messages: [{ msgClass: '', msg: 'This will delete' }] },
      ],
      footerClass: '',
      buttons: [
        { btnText: 'Cancel', btnClass: 'btn-outline', response: false },
        { btnText: 'Delete', btnClass: 'btn-full-success', response: true },
      ],
    };

    TestBed.configureTestingModule({
      declarations: [ ConforamtionPopupComponent ],
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
    fixture = TestBed.createComponent(ConforamtionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the injected dialog data as dialogDetails', () => {
    expect(component.dialogDetails).toBe(dialogData);
  });

  it('should render one button per configured button and close with its response on click', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.footer button'));
    expect(buttons.map(b => b.textContent!.trim())).toEqual(['Cancel', 'Delete']);
    buttons[1].click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with the response when there is no dialogAction', () => {
    component.closePopup(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(frameworkServiceSpy.retireMultipleTerm).not.toHaveBeenCalled();
  });

  it('should close without retiring when dialogAction is set and the response is false', () => {
    component.dialogDetails.dialogAction = 'retire';
    component.closePopup(false);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    expect(frameworkServiceSpy.retireMultipleTerm).not.toHaveBeenCalled();
  });

  it('should retire the term, update the parent and publish when confirmed', async () => {
    const child = { identifier: 'c1', code: 'c1code' };
    const other = { identifier: 'c2', code: 'c2code' };
    const parentCol: any = { children: [child, other], associations: [child, other], cardRef: 'ref' };
    frameworkServiceSpy.selectionList.set('parentCat', parentCol);
    frameworkServiceSpy.getPreviousCategory.and.returnValue({ code: 'parentCat' });
    frameworkServiceSpy.retireMultipleTerm.and.returnValue(of({}));
    frameworkServiceSpy.publishFramework.and.returnValue(of({}));
    component.dialogDetails.dialogAction = 'retire';
    component.dialogDetails.cardInfo = { category: 'theme', children: child };

    component.closePopup(true);
    await fixture.whenStable();

    expect(frameworkServiceSpy.retireMultipleTerm).toHaveBeenCalledWith('fw1', 'theme',
      { request: { contentIds: ['c1code'] } });
    expect(parentCol.children).toEqual([other]);
    expect(parentCol.associations).toEqual([other]);
    expect(frameworkServiceSpy.updateFrameworkList).toHaveBeenCalledWith('theme', parentCol, [child], 'delete');
    expect(frameworkServiceSpy.currentSelection.next).toHaveBeenCalledWith({ type: 'parentCat', data: parentCol, cardRef: 'ref' });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Competency theme deleted successfully.');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(component.showLoader).toBe(false);
  });

  it('should show an error snackbar when retiring fails', async () => {
    frameworkServiceSpy.retireMultipleTerm.and.returnValue(throwError(() => new Error('fail')));
    component.dialogDetails.dialogAction = 'retire';
    component.dialogDetails.cardInfo = { category: 'theme', children: { identifier: 'c1', code: 'c1code' } };

    component.closePopup(true);
    await fixture.whenStable();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Competency theme delete failed.');
    expect(component.showLoader).toBe(false);
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
