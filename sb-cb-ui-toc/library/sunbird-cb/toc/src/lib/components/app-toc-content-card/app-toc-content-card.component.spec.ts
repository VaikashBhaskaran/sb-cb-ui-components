import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule } from '@ngx-translate/core'
import { EventService, PipeDurationTransformModule, PipePartialContentModule } from '@sunbird-cb/utils-v2'

import { AppTocContentCardComponent } from './app-toc-content-card.component'

describe('AppTocContentCardComponent', () => {
  let component: AppTocContentCardComponent
  let fixture: ComponentFixture<AppTocContentCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocContentCardComponent],
      imports: [MatMenuModule, TranslateModule.forRoot(), PipeDurationTransformModule, PipePartialContentModule],
      providers: [
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn(), dispatchEvent: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
