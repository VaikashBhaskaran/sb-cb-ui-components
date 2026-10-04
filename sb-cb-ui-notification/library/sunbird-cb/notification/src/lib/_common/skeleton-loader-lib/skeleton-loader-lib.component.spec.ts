import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SkeletonLoaderLibComponent } from './skeleton-loader-lib.component'

describe('SkeletonLoaderLibComponent', () => {
  let component: SkeletonLoaderLibComponent
  let fixture: ComponentFixture<SkeletonLoaderLibComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonLoaderLibComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonLoaderLibComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
