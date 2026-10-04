import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { ConnectionNameComponent } from './connection-name.component'

describe('ConnectionNameComponent', () => {
  let component: ConnectionNameComponent
  let fixture: ComponentFixture<ConnectionNameComponent>
  const me: any = { userId: 'u1' }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionNameComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { snapshot: { data: { me } } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionNameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should read the current user from the parent route', () => {
    expect(component.me).toBe(me)
  })

  it('should build the avatar name', () => {
    expect(component.getUseravatarName).toBe('Guest')
    component.hoverUser = { firstName: 'Jane', lastName: 'Doe' }
    expect(component.getUseravatarName).toBe('Jane Doe')
    component.hoverUser = { personalDetails: { firstname: 'John', surname: 'Smith' } }
    expect(component.getUseravatarName).toBe('John Smith')
  })
})
