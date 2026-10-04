import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HorizontalScrollerV2Component } from './horizontal-scroller-v2.component'

describe('HorizontalScrollerV2Component', () => {
  let component: HorizontalScrollerV2Component
  let fixture: ComponentFixture<HorizontalScrollerV2Component>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalScrollerV2Component],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: 'environment', useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalScrollerV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
