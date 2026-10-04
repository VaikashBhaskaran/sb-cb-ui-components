import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

import { UserImageComponent } from './user-image.component'

describe('UserImageComponent', () => {
  let component: UserImageComponent
  let fixture: ComponentFixture<UserImageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserImageComponent],
      providers: [
        {
          provide: ConfigurationsService,
          useValue: { instanceConfig: { microsoft: { validEmailExtensions: ['@example.com'] } } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should compute short name and verified email on changes', () => {
    component.email = 'jane@example.com'
    component.userName = 'jane doe'
    component.ngOnChanges()
    expect(component.verifiedMicrosoftEmail).toBe('jane@example.com')
    expect(component.shortName).toBe('JD')
  })

  it('should fall back to initial image type without a user name', () => {
    component.imageType = 'rounded'
    component.ngOnChanges()
    expect(component.imageType).toBe('initial')
  })
})
