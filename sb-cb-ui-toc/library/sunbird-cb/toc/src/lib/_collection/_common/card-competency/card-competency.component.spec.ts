import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { CardCompetencyComponent } from './card-competency.component'

describe('CardCompetencyComponent', () => {
  let component: CardCompetencyComponent
  let fixture: ComponentFixture<CardCompetencyComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardCompetencyComponent],
      imports: [NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCompetencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle expanded state', () => {
    expect(component.isExpanded).toBe(false)
    component.handleToggleSize()
    expect(component.isExpanded).toBe(true)
  })
})
