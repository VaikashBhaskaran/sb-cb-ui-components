import { TranslateModule } from '@ngx-translate/core'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { SubmitQuizDialogComponent } from './submit-quiz-dialog.component'

describe('SubmitQuizDialogComponent', () => {
  let component: SubmitQuizDialogComponent
  let fixture: ComponentFixture<SubmitQuizDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitQuizDialogComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitQuizDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
