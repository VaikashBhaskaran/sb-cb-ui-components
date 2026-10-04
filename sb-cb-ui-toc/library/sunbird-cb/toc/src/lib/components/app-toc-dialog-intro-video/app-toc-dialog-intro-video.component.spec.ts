import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { AppTocDialogIntroVideoComponent } from './app-toc-dialog-intro-video.component'

describe('AppTocDialogIntroVideoComponent', () => {
  let component: AppTocDialogIntroVideoComponent
  let fixture: ComponentFixture<AppTocDialogIntroVideoComponent>
  let dialogRef: { close: jest.Mock }

  beforeEach(waitForAsync(() => {
    dialogRef = { close: jest.fn() }
    TestBed.configureTestingModule({
      declarations: [AppTocDialogIntroVideoComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: 'https://example.com/video.mp4' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocDialogIntroVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should build the intro video render config from dialog data', () => {
    expect(component.introVideoRenderConfig).toBeTruthy()
    expect((component.introVideoRenderConfig as any).widgetData).toEqual({
      url: 'https://example.com/video.mp4',
      autoplay: true,
    })
  })

  it('should close the dialog', () => {
    component.closeDialog()
    expect(dialogRef.close).toHaveBeenCalled()
  })
})
