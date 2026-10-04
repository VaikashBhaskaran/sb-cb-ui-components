import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService, EventService, PipeDurationTransformModule, UtilityService } from '@sunbird-cb/utils-v2'
import { of, Subject } from 'rxjs'

import { AiTutorComponent } from './ai-tutor.component'
import { RootService } from './../../../services/root.service'
import { WebSocketService } from './socket.service'

describe('AiTutorComponent', () => {
  let component: AiTutorComponent
  let fixture: ComponentFixture<AiTutorComponent>
  const eventSvcMock = { dispatchChatbotEvent: jest.fn() }
  const websocketSvcMock = {
    getJWTToken: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    closeConnection: jest.fn(),
    sendMessage: jest.fn(),
    getMessages: jest.fn().mockReturnValue(of()),
  }

  beforeEach(() => {
    localStorage.clear()
    eventSvcMock.dispatchChatbotEvent.mockClear()
    TestBed.configureTestingModule({
      declarations: [AiTutorComponent],
      imports: [FormsModule, PipeDurationTransformModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: Router, useValue: { events: new Subject(), navigate: jest.fn() } },
        {
          provide: ConfigurationsService,
          useValue: {
            userProfile: { userId: 'user-1', firstName: 'Test User' },
            unMappedUser: { userId: 'user-1' },
          },
        },
        { provide: EventService, useValue: eventSvcMock },
        {
          provide: RootService,
          useValue: {
            getLangugages: jest.fn().mockReturnValue(of({})),
            getChatData: jest.fn().mockReturnValue(of({})),
          },
        },
        { provide: WebSocketService, useValue: websocketSvcMock },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: UtilityService, useValue: { isMobile: false } },
        { provide: 'environment', useValue: { sitePath: 'portal.uat.karmayogibharat.net' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(AiTutorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialise hosts, user info and dispatch the loaded telemetry event', () => {
    expect(component.authTokenHost).toBe('learning-ai.uat.karmayogibharat.net')
    expect(component.userInfo.userId).toBe('user-1')
    expect(component.chatId).toMatch(/^user-1-\d+$/)
    expect(eventSvcMock.dispatchChatbotEvent).toHaveBeenCalled()
  })

  it('should connect to the websocket when a token is returned', () => {
    websocketSvcMock.getJWTToken.mockReturnValueOnce(of({ 'x-authenticated-user-token': 'token' }))
    component.ngOnInit()
    expect(websocketSvcMock.connect).toHaveBeenCalledWith('wss://learning-ai.uat.karmayogibharat.net/ws?token=token')
  })

  it('should toggle maximize state', () => {
    component.minimizeAITutor()
    expect(component.maximize).toBe(false)
    component.maximizeAITutor()
    expect(component.maximize).toBe(true)
  })
})
