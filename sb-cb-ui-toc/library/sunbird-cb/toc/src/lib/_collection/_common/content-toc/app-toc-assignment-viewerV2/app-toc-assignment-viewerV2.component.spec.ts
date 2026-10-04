import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NEVER, of } from 'rxjs'

import { AssignmentViewerV2Component } from './app-toc-assignment-viewerV2.component'
import { AppTocService } from '../../../../services/app-toc.service'

describe('AssignmentViewerV2Component', () => {
  let component: AssignmentViewerV2Component
  let fixture: ComponentFixture<AssignmentViewerV2Component>
  let tocSvc: any
  let snackBar: any
  let dialogRef: any
  let dialogData: any

  beforeEach(waitForAsync(() => {
    tocSvc = {
      readAssignmentFile: jest.fn().mockReturnValue(NEVER),
      submitAssignment: jest.fn().mockReturnValue(of({ responseCode: 'OK' })),
      submitDraftAssignment: jest.fn().mockReturnValue(of({ responseCode: 'OK' })),
      notifyAssignmentSubmission: jest.fn().mockReturnValue(of({})),
    }
    snackBar = { open: jest.fn() }
    dialogRef = { close: jest.fn() }
    dialogData = {
      url: 'https://host/path/my%20file.pdf?sig=abc',
      contentId: 'do_1',
      batchId: 'batch_1',
      assessment: { id: 'a1', formId: 'f1', title: 'Assignment', createdBy: 'u1' },
    }
    TestBed.configureTestingModule({
      declarations: [AssignmentViewerV2Component],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: AppTocService, useValue: tocSvc },
        { provide: ConfigurationsService, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: snackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentViewerV2Component)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should parse the file name from the url and request the file on init', () => {
    fixture.detectChanges()
    expect(component.fileName).toBe('my file.pdf')
    expect(component.fileType).toBe('pdf')
    expect(component.isLoading).toBe(true)
    expect(tocSvc.readAssignmentFile).toHaveBeenCalledWith('do_1', 'batch_1', 'f1', 'my file.pdf')
  })

  it('should show an error when content id is missing', () => {
    dialogData.contentId = ''
    fixture.detectChanges()
    expect(tocSvc.readAssignmentFile).not.toHaveBeenCalled()
    expect(component.error).toBe(true)
    expect(component.errorMessage).toBe('Content ID is missing')
    expect(snackBar.open).toHaveBeenCalledWith('Content ID is missing', 'Close', { duration: 5000 })
  })

  it('should save as draft and close the dialog on close', () => {
    fixture.detectChanges()
    component.handleClose()
    expect(tocSvc.submitDraftAssignment).toHaveBeenCalledWith({ submitUrl: dialogData.url, formId: 'f1' })
    expect(dialogRef.close).toHaveBeenCalled()
  })
})
