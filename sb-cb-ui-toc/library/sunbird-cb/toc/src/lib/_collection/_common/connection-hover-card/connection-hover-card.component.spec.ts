import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, provideRouter } from '@angular/router'
import { of } from 'rxjs'

import { ConnectionHoverCardComponent } from './connection-hover-card.component'

describe('ConnectionHoverCardComponent', () => {
  let component: ConnectionHoverCardComponent
  let fixture: ComponentFixture<ConnectionHoverCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionHoverCardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {}, params: {}, queryParams: {} },
            data: of({}),
            params: of({}),
            queryParams: of({}),
            parent: { snapshot: { data: { me: {} } } },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionHoverCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
