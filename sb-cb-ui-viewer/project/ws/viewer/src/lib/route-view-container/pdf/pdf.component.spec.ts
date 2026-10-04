import { PdfScormDataService } from '../../pdf-scorm-data-service'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { PdfComponent } from './pdf.component'

describe('PdfComponent', () => {
  let component: PdfComponent
  let fixture: ComponentFixture<PdfComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PdfComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        PdfScormDataService,
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
