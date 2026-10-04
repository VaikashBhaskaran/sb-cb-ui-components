import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule } from '@ngx-translate/core'
import { EventService, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'

import { CertificateDialogComponent } from './certificate-dialog.component'

describe('CertificateDialogComponent', () => {
  let component: CertificateDialogComponent
  let fixture: ComponentFixture<CertificateDialogComponent>
  let dialogData: any
  const eventSvcMock = { raiseInteractTelemetry: jest.fn() }

  function setup(data: any) {
    dialogData = data
    TestBed.configureTestingModule({
      declarations: [CertificateDialogComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule, PipeSafeSanitizerModule],
      providers: [
        { provide: EventService, useValue: eventSvcMock },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: 'environment', useValue: { contentHost: 'https://host' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    fixture = TestBed.createComponent(CertificateDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  it('should create', waitForAsync(() => {
    setup({ cet: 'data:image/svg+xml;base64,abc', certId: 'cert-1' })
    expect(component).toBeTruthy()
    expect(component.url).toBe(dialogData.cet)
  }))

  it('should build the course certificate share url', waitForAsync(() => {
    setup({ cet: '', certId: 'cert-1' })
    expect(component.getCertificateUrl()).toBe('https://host/apis/public/v8/cert/download/cert-1')
    expect(component.navUrl).toContain(encodeURIComponent('https://host/apis/public/v8/cert/download/cert-1'))
  }))

  it('should build the milestone certificate url for achievements', waitForAsync(() => {
    setup({ cet: '', certId: 'cert-2', isAchievement: true })
    expect(component.getCertificateUrl()).toBe('https://host/apis/public/v8/milestone/cert/download/cert-2')
  }))
})
