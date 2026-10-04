import { PendingFunctionService } from './services/pending-function.service'
import { AppTocService } from './services/app-toc.service'
import { TranslateModule } from '@ngx-translate/core'
import { PdfScormDataService } from './pdf-scorm-data-service'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ViewerComponent } from './viewer.component'

describe('ViewerComponent', () => {
  let component: ViewerComponent
  let fixture: ComponentFixture<ViewerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        PdfScormDataService,
        AppTocService,
        PendingFunctionService,
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
