import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { EventService, LoggerService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { ContentRatingV2DialogComponent } from './content-rating-v2-dialog.component'
import { RatingService } from '../../../_services/rating.service'

describe('ContentRatingV2DialogComponent', () => {
  let component: ContentRatingV2DialogComponent
  let fixture: ComponentFixture<ContentRatingV2DialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentRatingV2DialogComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { content: { identifier: 'do_123', primaryCategory: 'Course' }, userId: 'user1' } },
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn(), dispatchEvent: jest.fn() } },
        { provide: RatingService, useValue: { addOrUpdateRating: jest.fn().mockReturnValue(of({})) } },
        { provide: LoggerService, useValue: { error: jest.fn(), log: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRatingV2DialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
