import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ViewerPreviewPopupComponent } from './viewer-preview-popup.component'

describe('ViewerPreviewPopupComponent', () => {
  let component: ViewerPreviewPopupComponent
  let fixture: ComponentFixture<ViewerPreviewPopupComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ViewerPreviewPopupComponent, HttpClientTestingModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(ViewerPreviewPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
