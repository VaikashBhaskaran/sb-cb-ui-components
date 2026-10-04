import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { SearchListingService } from '../../_services/search-listing.service';

import { DesignationCardComponent } from './designation-card.component';

describe('DesignationCardComponent', () => {
  let component: DesignationCardComponent;
  let fixture: ComponentFixture<DesignationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationCardComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: SearchListingService, useValue: { searchConfig: {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DesignationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
