import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocAnalyticsTilesComponent } from './app-toc-analytics-tiles.component'

describe('AppTocAnalyticsTilesComponent', () => {
  let component: AppTocAnalyticsTilesComponent
  let fixture: ComponentFixture<AppTocAnalyticsTilesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocAnalyticsTilesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocAnalyticsTilesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
