import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { TocKpiValuesComponent } from './toc-kpi-values.component'

describe('TocKpiValuesComponent', () => {
  let component: TocKpiValuesComponent
  let fixture: ComponentFixture<TocKpiValuesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TocKpiValuesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TocKpiValuesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
