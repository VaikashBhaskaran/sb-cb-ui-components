import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { DatePipe } from '@angular/common'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateModule } from '@ngx-translate/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { EnrollProfileFormComponent } from './enroll-profile-form.component'
import { UserProfileService } from '../../services/user-profile.service'
import { ProfileV2Service } from '../../services/profile-v2.service'
import { OtpService } from '../../services/otp.service'
import { NPSGridService } from '../../services/nps-grid.service'

describe('EnrollProfileFormComponent', () => {
  let component: EnrollProfileFormComponent
  let fixture: ComponentFixture<EnrollProfileFormComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollProfileFormComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        DatePipe,
        {
          provide: UserProfileService,
          useValue: {
            getGroups: jest.fn().mockReturnValue(of({ result: { response: [] } })),
            getMasterLanguages: jest.fn().mockReturnValue(of({ languages: [] })),
            getWhiteListDomain: jest.fn().mockReturnValue(of({})),
            searchDesignation: jest.fn().mockReturnValue(of({})),
            searchIgotDesignation: jest.fn().mockReturnValue(of({})),
            editProfileDetails: jest.fn().mockReturnValue(of({})),
            updatePrimaryEmailDetails: jest.fn().mockReturnValue(of({})),
            handleTranslateTo: jest.fn().mockImplementation((key: string) => key),
          },
        },
        {
          provide: ProfileV2Service,
          useValue: {
            fetchApprovalDetails: jest.fn().mockReturnValue(of({ result: { data: [] } })),
            fetchCadre: jest.fn().mockReturnValue(of({})),
            getFormV2ByID: jest.fn().mockReturnValue(of({})),
            withDrawApprovalRequest: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: OtpService,
          useValue: {
            sendOtp: jest.fn().mockReturnValue(of({})),
            resendOtp: jest.fn().mockReturnValue(of({})),
            verifyOTP: jest.fn().mockReturnValue(of({})),
            sendEmailOtp: jest.fn().mockReturnValue(of({})),
            verifyEmailOTP: jest.fn().mockReturnValue(of({})),
          },
        },
        { provide: NPSGridService, useValue: { submitBpFormWithProfileDetails: jest.fn().mockReturnValue(of({})) } },
        {
          provide: ConfigurationsService,
          useValue: {
            unMappedUser: {
              rootOrgId: 'org1',
              profileDetails: { personalDetails: { mobile: '', primaryEmail: '', phoneVerified: false } },
            },
          },
        },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            batchData: { batchAttributes: { userProfileFileds: '' } },
            surveyId: '',
            showDoptChanges: false,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollProfileFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
