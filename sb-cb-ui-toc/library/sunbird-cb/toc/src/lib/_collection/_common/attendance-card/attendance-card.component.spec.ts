import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { of } from 'rxjs'
import { AttendanceCardComponent } from './attendance-card.component'
import { AttendanceHelperComponent } from '../attendance-helper/attendance-helper.component'

describe('AttendanceCardComponent', () => {
  let component: AttendanceCardComponent
  let fixture: ComponentFixture<AttendanceCardComponent>
  let dialog: any

  beforeEach(waitForAsync(() => {
    dialog = { open: jest.fn().mockReturnValue({ afterClosed: () => of(null) }) }
    TestBed.configureTestingModule({
      declarations: [AttendanceCardComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialog }],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should open the attendance helper dialog with helper config', () => {
    component.config = { attendenceHelp: { title: 'help' } }
    component.openHelp('content')
    expect(dialog.open).toHaveBeenCalledWith(AttendanceHelperComponent, {
      maxWidth: '1250px',
      data: { content: 'content', helperConfig: { title: 'help' } },
    })
  })
})
