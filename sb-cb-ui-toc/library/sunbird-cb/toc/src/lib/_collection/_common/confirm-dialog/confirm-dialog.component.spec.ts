import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { ConfirmDialogComponent } from './confirm-dialog.component'

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent
  let fixture: ComponentFixture<ConfirmDialogComponent>

  beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: MatDialogRef, useValue: { close: jest.fn() } },
          { provide: MAT_DIALOG_DATA, useValue: { title: 'Title', message: 'Message', acceptButton: 'Ok', cancelButton: 'Cancel' } },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents()
    }
  ))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
