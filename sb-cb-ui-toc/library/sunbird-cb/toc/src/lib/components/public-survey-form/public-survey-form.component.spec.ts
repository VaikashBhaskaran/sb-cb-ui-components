import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateModule } from '@ngx-translate/core'
import { of } from 'rxjs'

import { PublicSurveyFormComponent } from './public-survey-form.component'
import { AppTocService } from '../../services/app-toc.service'

describe('PublicSurveyFormComponent', () => {
  let component: PublicSurveyFormComponent
  let fixture: ComponentFixture<PublicSurveyFormComponent>
  const appTocSvcMock = {
    getFormByIdPublic: jest.fn().mockReturnValue(of({
      result: {
        response: {
          title: 'Survey',
          fields: [
            { id: 'q1', name: 'Email', fieldType: 'email', isRequired: true },
          ],
        },
      },
    })),
    submitFormPublic: jest.fn().mockReturnValue(of({})),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicSurveyFormComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { surveyId: 'survey-1', forPreview: false } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: AppTocService, useValue: appTocSvcMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(PublicSurveyFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch the survey form and build the form controls', () => {
    expect(appTocSvcMock.getFormByIdPublic).toHaveBeenCalledWith('survey-1')
    expect(component.formDetails.title).toBe('Survey')
    expect(component.questionsArray.length).toBe(1)
    expect(component.surveyFormIsValid).toBe(false)
  })
})
