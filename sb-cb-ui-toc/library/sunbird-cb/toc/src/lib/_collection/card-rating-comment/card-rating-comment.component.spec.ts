import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

import { CardRatingCommentComponent } from './card-rating-comment.component'
import { RatingService } from '../../_services/rating.service'

describe('CardRatingCommentComponent', () => {
  let component: CardRatingCommentComponent
  let fixture: ComponentFixture<CardRatingCommentComponent>
  const ratingServiceMock = {
    getRatingIcon: jest.fn().mockReturnValue('star'),
    getRatingIconClass: jest.fn().mockReturnValue(true),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardRatingCommentComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: RatingService, useValue: ratingServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRatingCommentComponent)
    component = fixture.componentInstance
    component.review = { firstName: 'Jane', rating: 4, review: 'Good course', comment: 'Thanks' }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set author reply from the review input on init', () => {
    expect(component.authorReply).toBe('Thanks')
  })

  it('should return the reviewer first name', () => {
    expect(component.getFullName({ firstName: 'Jane' })).toBe('Jane')
  })

  it('should toggle author reply visibility', () => {
    expect(component.showauthreply).toBe(false)
    component.showAuthReply()
    expect(component.showauthreply).toBe(true)
  })

  it('should set author reply from review comment', () => {
    component.getAuthorReply({ comment: 'thanks' })
    expect(component.authorReply).toBe('thanks')
  })

  it('should delegate rating icon helpers to RatingService', () => {
    expect(component.getRatingIcon(1, 4)).toBe('star')
    expect(ratingServiceMock.getRatingIcon).toHaveBeenCalledWith(1, 4)
    expect(component.getRatingIconClass(1, 4)).toBe(true)
    expect(ratingServiceMock.getRatingIconClass).toHaveBeenCalledWith(1, 4)
  })
})
