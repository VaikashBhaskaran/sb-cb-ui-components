import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { ConfirmDialogComponent } from './confirm-dialog.component'
import { MarkAsCompleteService } from '../mark-as-complete.service'
import { ContentProgressService } from '../../content-progress/content-progress.service'

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent
  let fixture: ComponentFixture<ConfirmDialogComponent>
  let dialogRef: { close: jest.Mock }
  let markAsCompleteSvc: { markAsComplete: jest.Mock }
  let progressSvc: { updateProgressHash: jest.Mock }
  let snackBar: { open: jest.Mock }
  const data: any = { body: {}, contentId: 'c1' }

  beforeEach(waitForAsync(() => {
    dialogRef = { close: jest.fn() }
    markAsCompleteSvc = { markAsComplete: jest.fn().mockResolvedValue({ c1: 1 }) }
    progressSvc = { updateProgressHash: jest.fn() }
    snackBar = { open: jest.fn() }
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MarkAsCompleteService, useValue: markAsCompleteSvc },
        { provide: ContentProgressService, useValue: progressSvc },
        { provide: MatSnackBar, useValue: snackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should close the dialog', () => {
    component.close()
    expect(dialogRef.close).toHaveBeenCalled()
  })

  it('should mark as complete and close with Marked', async () => {
    component.markAsComplete()
    expect(component.fetchStatus).toBe('fetching')
    await Promise.resolve()
    await Promise.resolve()
    expect(markAsCompleteSvc.markAsComplete).toHaveBeenCalledWith(data.body, 'c1')
    expect(progressSvc.updateProgressHash).toHaveBeenCalledWith({ c1: 1 })
    expect(component.fetchStatus).toBe('fetched')
    expect(dialogRef.close).toHaveBeenCalledWith('Marked')
  })

  it('should set failed status when marking fails', async () => {
    markAsCompleteSvc.markAsComplete.mockRejectedValue(new Error('x'))
    component.markAsComplete()
    await Promise.resolve()
    await Promise.resolve()
    expect(component.fetchStatus).toBe('failed')
    expect(snackBar.open).toHaveBeenCalledWith('Failed')
  })
})
