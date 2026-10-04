import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'

import { EnrollQuestionnaireComponent } from './enroll-questionnaire.component'
import { AppTocService } from '../../services/app-toc.service'

describe('EnrollQuestionnaireComponent', () => {
  let component: EnrollQuestionnaireComponent
  let fixture: ComponentFixture<EnrollQuestionnaireComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollQuestionnaireComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { surveyId: 'survey-1', wfClientVersion: 1 } },
        {
          provide: AppTocService,
          useValue: {
            getFormById: jest.fn().mockReturnValue(of({ result: { response: { title: '', fields: [] } } })),
            submitForm: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollQuestionnaireComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
