import { of } from 'rxjs'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { HtmlPickerComponent } from './html-picker.component'

describe('HtmlPickerComponent', () => {
  let component: HtmlPickerComponent
  let fixture: ComponentFixture<HtmlPickerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlPickerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ content: { data: { identifier: 'test-id', artifactUrl: '', mimeType: '', subTitles: [] } } }),
            params: of({}),
            queryParams: of({}),
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
            snapshot: { data: {}, params: {}, queryParams: {}, paramMap: convertToParamMap({}), queryParamMap: convertToParamMap({}) },
          },
        },
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlPickerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
