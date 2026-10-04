import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule } from '@ngx-translate/core'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'

import { ReviewsContentComponent } from './reviews-content.component'
import { ReviewComponentDataService } from '../content-services/review-component-data.service'

describe('ReviewsContentComponent', () => {
  let component: ReviewsContentComponent
  let fixture: ComponentFixture<ReviewsContentComponent>
  const dialogRefMock = { close: jest.fn() }
  let dialogData: any

  beforeEach(waitForAsync(() => {
    dialogData = {
      reviews: {
        a: { review: 'great course', firstName: 'alice' },
        b: { review: 'okay', firstName: 'bob' },
      },
    }
    TestBed.configureTestingModule({
      declarations: [ReviewsContentComponent],
      imports: [TranslateModule.forRoot(), PipeRelativeTimeModule, MatMenuModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load reviews from dialog data on init', () => {
    expect(component.reviews.length).toBe(2)
  })

  it('should update reviews when review data service emits', () => {
    const newReviews = [{ review: 'new', firstName: 'carol' }]
    TestBed.inject(ReviewComponentDataService).setReviewData(newReviews)
    expect(component.reviews).toEqual(newReviews)
  })

  it('should close the dialog', () => {
    component.handleCloseModal()
    expect(dialogRefMock.close).toHaveBeenCalled()
  })

  it('should capitalize names and comments', () => {
    expect(component.handleCapitalize('john doe', 'name')).toBe('John Doe')
    expect(component.handleCapitalize('nice course')).toBe('Nice course')
  })
})
