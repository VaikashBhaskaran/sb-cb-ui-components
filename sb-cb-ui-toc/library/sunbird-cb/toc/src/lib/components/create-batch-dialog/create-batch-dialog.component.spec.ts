import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { CreateBatchDialogComponent } from './create-batch-dialog.component'
import { AppTocService } from '../../services/app-toc.service'

describe('CreateBatchDialogComponent', () => {
  let component: CreateBatchDialogComponent
  let fixture: ComponentFixture<CreateBatchDialogComponent>
  let dialogRef: { close: jest.Mock }
  let appTocService: { createBatch: jest.Mock }
  let snackBar: { open: jest.Mock }

  beforeEach(waitForAsync(() => {
    dialogRef = { close: jest.fn() }
    appTocService = { createBatch: jest.fn().mockReturnValue(of({})) }
    snackBar = { open: jest.fn() }
    TestBed.configureTestingModule({
      declarations: [CreateBatchDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { content: { identifier: 'do_123' } } },
        { provide: AppTocService, useValue: appTocService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: ConfigurationsService, useValue: { userProfile: { userId: 'u1' } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise the form with the default enrollment type', () => {
    expect(component.createBatchForm.value.enrollmentType).toBe('open')
    expect(component.createBatchForm.valid).toBe(false)
  })

  it('should submit the batch and close the dialog', () => {
    const form: any = { value: { name: 'Batch', startDate: '2024-01-05', endDate: '', enrollmentEndDate: '' } }
    component.createBatchSubmit(form)
    expect(appTocService.createBatch).toHaveBeenCalledWith({
      name: 'Batch',
      startDate: '2024-01-05',
      mentors: [],
      createdBy: 'u1',
      courseId: 'do_123',
    })
    expect(component.uploadSaveData).toBe(false)
    expect(snackBar.open).toHaveBeenCalled()
    expect(dialogRef.close).toHaveBeenCalled()
  })
})
