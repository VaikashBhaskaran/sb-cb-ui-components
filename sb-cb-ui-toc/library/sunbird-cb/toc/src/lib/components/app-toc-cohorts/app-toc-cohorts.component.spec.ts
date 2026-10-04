import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of, throwError } from 'rxjs'

import { AppTocCohortsComponent } from './app-toc-cohorts.component'
import { AppTocService } from '../../services/app-toc.service'
import { NsCohorts } from '../../models/app-toc.model'

describe('AppTocCohortsComponent', () => {
  let component: AppTocCohortsComponent
  let fixture: ComponentFixture<AppTocCohortsComponent>
  let tocSvc: any
  let router: any
  let configSvc: any

  beforeEach(waitForAsync(() => {
    tocSvc = { fetchContentCohorts: jest.fn().mockReturnValue(of([])) }
    router = { navigate: jest.fn() }
    configSvc = { restrictedFeatures: new Set<string>() }
    TestBed.configureTestingModule({
      declarations: [AppTocCohortsComponent],
      providers: [
        { provide: AppTocService, useValue: tocSvc },
        { provide: ConfigurationsService, useValue: configSvc },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocCohortsComponent)
    component = fixture.componentInstance
    component.content = { identifier: 'do_1' } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch cohorts once and cache the result', () => {
    component.fetchCohorts(NsCohorts.ECohortTypes.ACTIVE_USERS)
    component.fetchCohorts(NsCohorts.ECohortTypes.ACTIVE_USERS)
    expect(tocSvc.fetchContentCohorts).toHaveBeenCalledTimes(1)
    expect(tocSvc.fetchContentCohorts).toHaveBeenCalledWith(NsCohorts.ECohortTypes.ACTIVE_USERS, 'do_1')
    expect(component.cohortResults[NsCohorts.ECohortTypes.ACTIVE_USERS]).toEqual({ contents: [], hasError: false })
  })

  it('should flag an error when fetching cohorts fails', () => {
    tocSvc.fetchContentCohorts.mockReturnValue(throwError(() => new Error('fail')))
    component.fetchCohorts(NsCohorts.ECohortTypes.ACTIVE_USERS)
    expect(component.cohortResults[NsCohorts.ECohortTypes.ACTIVE_USERS]).toEqual({ contents: [], hasError: true })
  })

  it('should build the user full name', () => {
    expect(component.getUserFullName({ first_name: ' John ', last_name: ' Doe ' })).toBe('John Doe')
    expect(component.getUserFullName({})).toBe('')
  })
})
