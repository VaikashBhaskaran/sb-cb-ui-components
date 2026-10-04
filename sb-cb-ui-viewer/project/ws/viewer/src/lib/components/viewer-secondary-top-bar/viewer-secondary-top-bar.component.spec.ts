import { AppTocService } from '../../services/app-toc.service'
import { PdfScormDataService } from '../../pdf-scorm-data-service'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewerSecondaryTopBarComponent } from './viewer-secondary-top-bar.component'

describe('ViewerSecondaryTopBarComponent', () => {
  let component: ViewerSecondaryTopBarComponent
  let fixture: ComponentFixture<ViewerSecondaryTopBarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewerSecondaryTopBarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        PdfScormDataService,
        AppTocService,
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerSecondaryTopBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
