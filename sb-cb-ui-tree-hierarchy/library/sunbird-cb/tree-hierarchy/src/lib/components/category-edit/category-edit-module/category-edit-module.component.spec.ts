import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CategoryEditModuleComponent } from './category-edit-module.component';

describe('CategoryEditModuleComponent', () => {
  let component: CategoryEditModuleComponent;
  let fixture: ComponentFixture<CategoryEditModuleComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryEditModuleComponent>>;
  const dialogData = { columnInfo: { name: 'Department', description: 'Dept desc', code: 'dept' } };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [CategoryEditModuleComponent],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    });
    fixture = TestBed.createComponent(CategoryEditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise the form from dialog data', () => {
    expect(component.categoryForm.value).toEqual({ categoryName: 'Department', categoryDescription: 'Dept desc' });
  });

  it('closeDialog should close without a result', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('saveCategoryName should close with the updated category when valid', () => {
    component.categoryForm.patchValue({ categoryName: 'Division', categoryDescription: 'New desc' });
    component.saveCategoryName();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      updated: true,
      column: {
        formData: { categoryName: 'Division', categotyDescription: 'New desc' },
        columnData: dialogData.columnInfo
      }
    });
  });

  it('saveCategoryName should not close when the name is empty', () => {
    component.categoryForm.patchValue({ categoryName: '' });
    component.saveCategoryName();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
