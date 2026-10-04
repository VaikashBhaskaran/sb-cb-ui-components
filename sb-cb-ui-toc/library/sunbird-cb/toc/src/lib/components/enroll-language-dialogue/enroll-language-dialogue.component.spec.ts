import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { EnrollLanguageDialogueComponent } from './enroll-language-dialogue.component'

describe('EnrollLanguageDialogueComponent', () => {
  let component: EnrollLanguageDialogueComponent
  let fixture: ComponentFixture<EnrollLanguageDialogueComponent>
  const dialogRefMock = { close: jest.fn() }
  const languageList = [{ langId: 'en', name: 'English' }, { langId: 'hi', name: 'Hindi' }]

  function setup(data: any) {
    TestBed.configureTestingModule({
      declarations: [EnrollLanguageDialogueComponent],
      imports: [FormsModule, MatSelectModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(EnrollLanguageDialogueComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  beforeEach(() => {
    dialogRefMock.close.mockClear()
  })

  it('should create', () => {
    setup({ languageList })
    expect(component).toBeTruthy()
  })

  it('should select the first language by default', () => {
    setup({ languageList })
    expect(component.selectedLanguage).toEqual(languageList[0])
  })

  it('should pre-select the given language', () => {
    setup({ languageList, preSelect: { langId: 'hi' } })
    expect(component.selectedLanguage).toEqual(languageList[1])
  })

  it('should close the dialog with the selected language on submit', () => {
    setup({ languageList })
    component.onSubmit()
    expect(dialogRefMock.close).toHaveBeenCalledWith(languageList[0])
  })
})
