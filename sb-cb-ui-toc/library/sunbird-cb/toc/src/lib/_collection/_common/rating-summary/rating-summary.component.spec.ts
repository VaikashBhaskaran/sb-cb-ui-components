import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

import { RatingSummaryComponent } from './rating-summary.component'
import { RatingService } from '../../../_services/rating.service'

describe('RatingSummaryComponent', () => {
  let component: RatingSummaryComponent
  let fixture: ComponentFixture<RatingSummaryComponent>
  const ratingServiceMock = {
    getRatingIcon: jest.fn().mockReturnValue('star_half'),
    getRatingIconClass: jest.fn().mockReturnValue(false),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RatingSummaryComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: RatingService, useValue: ratingServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should delegate rating icon helpers to RatingService', () => {
    expect(component.getRatingIcon(3, 2.5)).toBe('star_half')
    expect(ratingServiceMock.getRatingIcon).toHaveBeenCalledWith(3, 2.5)
    expect(component.getRatingIconClass(3, 2.5)).toBe(false)
    expect(ratingServiceMock.getRatingIconClass).toHaveBeenCalledWith(3, 2.5)
  })
})
