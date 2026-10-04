import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocSessionsNewComponent } from './app-toc-sessions-new.component'

describe('AppTocSessionsComponent', () => {
  let component: AppTocSessionsNewComponent
  let fixture: ComponentFixture<AppTocSessionsNewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionsNewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionsNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
