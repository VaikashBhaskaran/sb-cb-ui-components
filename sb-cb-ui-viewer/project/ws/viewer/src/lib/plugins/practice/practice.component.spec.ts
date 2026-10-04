import { PendingFunctionService } from '../../services/pending-function.service'
import { AppTocService } from '../../services/app-toc.service'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { PracticeComponent } from './practice.component'

describe('PracticeComponent', () => {
  let component: PracticeComponent
  let fixture: ComponentFixture<PracticeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppTocService,
        PendingFunctionService,
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
