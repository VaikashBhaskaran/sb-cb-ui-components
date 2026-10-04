import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'

import { SamuhikCharchaContentComponent } from './samuhik-charcha-content.component'
import { SamuhikCharchaService } from '../../../../../_services/samuhik-charcha.service'

describe('SamuhikCharchaContentComponent', () => {
  let component: SamuhikCharchaContentComponent
  let fixture: ComponentFixture<SamuhikCharchaContentComponent>

  const buildConfig = () => ({
    strips: [
      {
        viewMoreUrl: { path: '/app/events?x=1', queryParams: {} },
        tabs: [
          { request: { searchV6: { request: { filters: { endDateTime: { '>=': '' } } } } } },
        ],
      },
    ],
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamuhikCharchaContentComponent],
      providers: [
        { provide: SamuhikCharchaService, useValue: { fetchConfigFile: jest.fn().mockImplementation(() => of(buildConfig())) } },
        { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn() } },
        { provide: ConfigurationsService, useValue: { userProfile: { userRootOrg: { id: 'org1' } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(SamuhikCharchaContentComponent)
    component = fixture.componentInstance
  })

  it('should create', async () => {
    component.content = { identifier: 'do_1', eventLinked: [] }
    fixture.detectChanges()
    await fixture.whenStable()
    expect(component).toBeTruthy()
  })

  it('should lock and apply content filters on init', async () => {
    component.content = { identifier: 'do_1', eventLinked: ['ev1'] }
    component.conditionData = { userEnrollmentList: [{ completionPercentage: 10 }] }
    await component.ngOnInit()
    expect(component.locked).toBe(true)
    expect(component.samuhikConfigLoaded).toBe(true)
    const filters = component.samuhikConfig.strips[0].tabs[0].request.searchV6.request.filters
    expect(filters.identifier).toEqual(['ev1'])
    expect(filters.createdFor).toEqual(['org1'])
    expect(component.samuhikConfig.strips[0].viewMoreUrl.path).toBe('/app/events')
    expect(component.samuhikConfig.strips[0].viewMoreUrl.queryParams.courseId).toBe('do_1')
  })
})
