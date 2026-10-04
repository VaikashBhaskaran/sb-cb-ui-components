import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { HorizontalScrollerComponent } from './horizontal-scroller.component'

describe('HorizontalScrollerComponent', () => {
  let component: HorizontalScrollerComponent
  let fixture: ComponentFixture<HorizontalScrollerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalScrollerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalScrollerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
