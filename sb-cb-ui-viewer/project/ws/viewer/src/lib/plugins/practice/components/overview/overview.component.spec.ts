import { TranslateModule } from '@ngx-translate/core'
import { PipeDurationTransformModule, PipeLimitToModule } from '@sunbird-cb/utils-v2'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { OverviewComponent } from './overview.component'

describe('OverviewComponent', () => {
  let component: OverviewComponent
  let fixture: ComponentFixture<OverviewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, PipeDurationTransformModule, PipeLimitToModule, TranslateModule.forRoot()],
      providers: [
        { provide: 'environment', useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
