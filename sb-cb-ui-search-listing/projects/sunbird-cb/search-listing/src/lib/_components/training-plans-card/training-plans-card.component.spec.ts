import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

import { TrainingPlansCardComponent } from './training-plans-card.component';

@Pipe({
  name: 'plural',
  standalone: false
})
class MockPluralPipe implements PipeTransform {
  transform(value: number, singular: string, plural: string): string {
    return value === 1 ? singular : plural;
  }
}

describe('TrainingPlansCardComponent', () => {
  let component: TrainingPlansCardComponent;
  let fixture: ComponentFixture<TrainingPlansCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingPlansCardComponent, MockPluralPipe],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ConfigurationsService, useValue: { userProfile: {}, userRoles: new Set<string>() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TrainingPlansCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
