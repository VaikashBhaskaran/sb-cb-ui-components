import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { HandsOnComponent } from './hands-on.component'

describe('HandsOnComponent', () => {
  let component: HandsOnComponent
  let fixture: ComponentFixture<HandsOnComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HandsOnComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HandsOnComponent)
    component = fixture.componentInstance
    component.exerciseData = { supportedLanguages: [{ language: 'python', mode: 'python' }], starterCodes: [''] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
