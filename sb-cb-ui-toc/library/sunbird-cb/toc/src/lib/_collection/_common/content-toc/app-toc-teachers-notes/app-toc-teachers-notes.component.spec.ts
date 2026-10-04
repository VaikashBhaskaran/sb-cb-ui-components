import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { EventService } from '@sunbird-cb/utils-v2'

import { AppTocTeachersNotesComponent } from './app-toc-teachers-notes.component'

describe('AppTocTeachersNotesComponent', () => {
  let component: AppTocTeachersNotesComponent
  let fixture: ComponentFixture<AppTocTeachersNotesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocTeachersNotesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: EventService, useValue: { dispatchChatbotEvent: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocTeachersNotesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should detect teacher resources matching the display type', () => {
    component.notesDisplayType = 'Teachers Notes'
    component.content = { identifier: 'do_1', referenceNodes: [{ resourceCategory: 'Teachers Notes' }] } as any
    expect(component.hasTeacherResources()).toBe(true)
    component.notesDisplayType = 'Reference Resource'
    expect(component.hasTeacherResources()).toBe(false)
  })
})
