import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { UserAutocompleteComponent } from './user-autocomplete.component'
import { UserAutocompleteService } from './user-autocomplete.service'

describe('UserAutocompleteComponent', () => {
  let component: UserAutocompleteComponent
  let fixture: ComponentFixture<UserAutocompleteComponent>
  const snackBarMock = { open: jest.fn() }

  beforeEach(waitForAsync(() => {
    snackBarMock.open.mockClear()
    TestBed.configureTestingModule({
      declarations: [UserAutocompleteComponent],
      imports: [ReactiveFormsModule, MatAutocompleteModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        {
          provide: UserAutocompleteService,
          useValue: {
            fetchAutoComplete: jest.fn().mockReturnValue(of([])),
            fetchAutoCompleteByDept: jest.fn().mockReturnValue(of([])),
          },
        },
        { provide: ConfigurationsService, useValue: { userProfile: { userId: 'self' } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAutocompleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component.userId).toBe('self')
  })

  it('should add a selected user and reject duplicates', () => {
    const event: any = { option: { value: { wid: 'u1' } } }
    component.selectUser(event, 'duplicate', 'self')
    expect(component.selectedUsers.length).toBe(1)
    component.selectUser(event, 'duplicate', 'self')
    expect(component.selectedUsers.length).toBe(1)
    expect(snackBarMock.open).toHaveBeenCalledWith('duplicate')
  })

  it('should not allow selecting self', () => {
    component.selectUser({ option: { value: { wid: 'self' } } } as any, 'duplicate', 'selfShare')
    expect(component.selectedUsers.length).toBe(0)
    expect(snackBarMock.open).toHaveBeenCalledWith('selfShare')
  })

  it('should remove a selected user', () => {
    component.selectedUsers = [{ wid: 'u1' } as any]
    component.removeUser({ wid: 'u1' } as any)
    expect(component.selectedUsers.length).toBe(0)
  })
})
