import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup } from '@angular/forms'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'

import { SurveyFormQuestionComponent } from './survey-form-question.component'

describe('SurveyFormQuestionComponent', () => {
  let component: SurveyFormQuestionComponent
  let fixture: ComponentFixture<SurveyFormQuestionComponent>

  const setup = (fieldType: string) => {
    fixture = TestBed.createComponent(SurveyFormQuestionComponent)
    component = fixture.componentInstance
    component.questionForm = new FormGroup({
      question: new FormControl('What is your age?'),
      answer: new FormControl(''),
      isNA: new FormControl(false),
    })
    component.fieldDetails = { fieldType, isRequired: false }
    fixture.detectChanges()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SurveyFormQuestionComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations()],
    })
  })

  it('should create', () => {
    setup('text')
    expect(component).toBeTruthy()
  })

  it('should emit the answer when the value changes', () => {
    setup('text')
    const emitSpy = jest.spyOn(component.questionValues, 'emit')
    component.answerControl.setValue('hello')
    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ answer: 'hello' }))
  })

  it('should strip non-numeric characters for numeric fields', () => {
    setup('numeric')
    component.answerControl.setValue('12a.5')
    expect(component.answerControl.value).toBe('12.5')
  })
})
