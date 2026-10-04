import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { ShareTocComponent } from './share-toc.component'
import { AppTocService } from '../../services/app-toc.service'
import { UserAutocompleteService } from '../../_collection/_common/user-autocomplete/user-autocomplete.service'

describe('ShareTocComponent', () => {
  let component: ShareTocComponent
  let fixture: ComponentFixture<ShareTocComponent>
  const eventSvcMock = { raiseInteractTelemetry: jest.fn() }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShareTocComponent],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, MatAutocompleteModule],
      providers: [
        { provide: UserAutocompleteService, useValue: { searchUser: jest.fn().mockReturnValue(of({})) } },
        {
          provide: MultilingualTranslationsService,
          useValue: { languageSelectedObservable: of(), translateActualLabel: jest.fn().mockReturnValue('') },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: ConfigurationsService, useValue: {} },
        { provide: AppTocService, useValue: { shareContent: jest.fn().mockReturnValue(of({ responseCode: 'OK' })) } },
        { provide: EventService, useValue: eventSvcMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTocComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should remove a user', () => {
    component.users = ['a@b.com', 'c@d.com']
    component.remove('a@b.com')
    expect(component.users).toEqual(['c@d.com'])
  })

  it('should reset state and raise telemetry on close', () => {
    const emitSpy = jest.spyOn(component.resetEnableShare, 'emit')
    component.users = ['a@b.com']
    component.onClose()
    expect(component.users).toEqual([])
    expect(emitSpy).toHaveBeenCalledWith(false)
    expect(eventSvcMock.raiseInteractTelemetry).toHaveBeenCalled()
  })
})
