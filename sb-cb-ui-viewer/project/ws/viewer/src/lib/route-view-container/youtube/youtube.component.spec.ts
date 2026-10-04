import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { YoutubeComponent } from './youtube.component'

describe('YoutubeComponent', () => {
  let component: YoutubeComponent
  let fixture: ComponentFixture<YoutubeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
