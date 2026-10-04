import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { of } from 'rxjs'

import { MarkAsCompleteComponent } from './mark-as-complete.component'
import { WidgetContentService } from './../../../_services/widget-content.service'

describe('MarkAsCompleteComponent', () => {
  let component: MarkAsCompleteComponent
  let fixture: ComponentFixture<MarkAsCompleteComponent>
  const contentSvcMock = { fetchMarkAsCompleteMeta: jest.fn() }
  const dialogMock = { open: jest.fn() }

  beforeEach(waitForAsync(() => {
    contentSvcMock.fetchMarkAsCompleteMeta.mockReset().mockResolvedValue({ progressSupported: true })
    dialogMock.open.mockReset()
    TestBed.configureTestingModule({
      declarations: [MarkAsCompleteComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: WidgetContentService, useValue: contentSvcMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsCompleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch mark as complete meta and build the request body on content change', async () => {
    component.content = { identifier: 'do_1', contentType: 'Resource', mimeType: 'video/mp4' } as any
    component.ngOnChanges({ content: new SimpleChange(undefined, component.content, true) })
    await Promise.resolve()
    expect(contentSvcMock.fetchMarkAsCompleteMeta).toHaveBeenCalledWith('do_1')
    expect(component.content.progress).toEqual({ progressSupported: true })
    expect(component.reqBody).toEqual({
      content_type: 'Resource',
      current: ['1'],
      max_size: 1,
      mime_type: 'video/mp4',
      user_id_type: 'uuid',
    })
  })

  it('should mark content as completed when the dialog confirms', () => {
    dialogMock.open.mockReturnValue({ afterClosed: () => of('Marked') })
    component.content = { identifier: 'do_1', progress: {} } as any
    component.confirm()
    expect(dialogMock.open).toHaveBeenCalled()
    expect(component.content.progress).toEqual(expect.objectContaining({
      progressStatus: 'completed',
      showMarkAsComplete: false,
      markAsCompleteReason: 'already.completed',
    }))
  })

  it('should not open the dialog in preview mode', () => {
    component.forPreview = true
    component.confirm()
    expect(dialogMock.open).not.toHaveBeenCalled()
  })
})
