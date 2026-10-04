import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

import { AppTocSessionsComponent } from './app-toc-sessions.component'

describe('AppTocSessionsComponent', () => {
  let component: AppTocSessionsComponent
  let fixture: ComponentFixture<AppTocSessionsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionsComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionsComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should sort sessions by start date and time', () => {
    component.batchData = {
      content: [{
        batchAttributes: {
          sessionDetails_v2: [
            { identifier: 's3', startDate: '2024-01-02', startTime: '09:00 AM' },
            { identifier: 's2', startDate: '2024-01-01', startTime: '02:00 PM' },
            { identifier: 's1', startDate: '2024-01-01', startTime: '10:00 AM' },
          ],
        },
      }],
    }
    component.ngOnInit()
    expect(component.sessionList.map((s: any) => s.identifier)).toEqual(['s1', 's2', 's3'])
  })

  it('should track sessions by identifier', () => {
    expect(component.contentTrackBy(0, { identifier: 'abc' })).toBe('abc')
  })
})
