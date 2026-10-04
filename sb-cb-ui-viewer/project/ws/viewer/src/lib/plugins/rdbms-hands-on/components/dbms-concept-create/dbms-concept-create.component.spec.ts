import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { DbmsConceptCreateComponent } from './dbms-concept-create.component'

describe('DbmsConceptCreateComponent', () => {
  let component: DbmsConceptCreateComponent
  let fixture: ComponentFixture<DbmsConceptCreateComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DbmsConceptCreateComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DbmsConceptCreateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
