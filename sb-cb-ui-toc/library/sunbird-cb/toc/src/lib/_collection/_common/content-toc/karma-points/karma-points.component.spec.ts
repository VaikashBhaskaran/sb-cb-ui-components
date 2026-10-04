import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

import { KarmaPointsComponent } from './karma-points.component'

describe('KarmaPointsComponent', () => {
  let component: KarmaPointsComponent
  let fixture: ComponentFixture<KarmaPointsComponent>
  const langTranslationsMock = {
    translateLabelWithoutspace: jest.fn().mockReturnValue('translated'),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaPointsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MultilingualTranslationsService, useValue: langTranslationsMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaPointsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should construct slider data on init', () => {
    expect(component.karmaPointsSlider.type).toBe('karma-points')
    expect(component.karmaPointsSlider.sliderData).toBe(component.kpArray)
  })

  it('should collect karma point data for a button type', () => {
    component.data = [
      { displayButton: 'Enroll', points: 5 },
      { displayButton: 'ACBP CLAIM', points: 10 },
    ]
    component.getKPData('Enroll')
    component.getKPData('Enroll')
    expect(component.kpArray).toEqual([{ displayButton: 'Enroll', points: 5 }])
    expect(component.btnKPData).toEqual({ displayButton: 'ACBP CLAIM', points: 10 })
  })

  it('should emit claim and reset button category', () => {
    const emitSpy = jest.spyOn(component.clickClaimKarmaPoints, 'emit')
    component.btnCategory = 'claim'
    component.onClickOfClaim()
    expect(emitSpy).toHaveBeenCalledWith('claim')
    expect(component.btnCategory).toBe('')
  })

  it('should replace course with the primary category in dynamic text', () => {
    expect(component.getDynamicText('Enroll in this course')).toBe('Enroll in this course')
    component.pCategory = 'Program'
    expect(component.getDynamicText('Enroll in this course')).toBe('Enroll in this program')
  })
})
