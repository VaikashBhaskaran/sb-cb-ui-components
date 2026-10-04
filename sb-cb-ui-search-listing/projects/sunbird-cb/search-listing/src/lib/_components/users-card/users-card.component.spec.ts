import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { of } from 'rxjs';
import { SearchListingService } from '../../_services/search-listing.service';

import { UsersCardComponent } from './users-card.component';

describe('UsersCardComponent', () => {
  let component: UsersCardComponent;
  let fixture: ComponentFixture<UsersCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersCardComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ConfigurationsService, useValue: { userProfile: {} } },
        { provide: SearchListingService, useValue: { blockUser: jest.fn().mockReturnValue(of({})), unblockUser: jest.fn().mockReturnValue(of({})) } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn().mockReturnValue({ afterClosed: () => of(false) }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UsersCardComponent);
    component = fixture.componentInstance;
    component.user = { userId: 'user123', firstName: 'Test', createdDate: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
