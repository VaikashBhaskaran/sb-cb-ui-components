import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { LocalConnectionService } from '../../services/local-connection.service';
import { ConnectorComponent } from './connector.component';


describe('ConnectorComponent', () => {
  let component: ConnectorComponent;
  let fixture: ComponentFixture<ConnectorComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConnectorComponent>>;
  let localConnectionServiceMock: any;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    localConnectionServiceMock = {
      localStorage: {
        source: 'online',
        data: { endpoint: 'https://example.com/api', token: 'abc', frameworkName: 'fw1' },
      },
    };
    TestBed.configureTestingModule({
      declarations: [ ConnectorComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LocalConnectionService, useValue: localConnectionServiceMock },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise the form from the stored connection', () => {
    expect(component.connectorForm.value).toEqual({
      endpoint: 'https://example.com/api', token: 'abc', frameworkName: 'fw1',
    });
    expect(component.connectorForm.valid).toBe(true);
  });

  it('should close with the online connection when the form is valid', () => {
    component.saveConnection();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      source: 'online',
      data: { endpoint: 'https://example.com/api', token: 'abc', frameworkName: 'fw1' },
    });
  });

  it('should not close when the form is invalid', () => {
    component.connectorForm.patchValue({ endpoint: '', frameworkName: '' });
    component.saveConnection();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should reset the form and close with empty data on clear', () => {
    component.clear();
    expect(component.connectorForm.value.endpoint).toBeNull();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ source: 'online', data: {} });
  });

  it('should close with empty online data on dialogClose', () => {
    component.dialogClose();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ source: 'online', data: {} });
  });

  it('should close with the offline source on loadDefault', () => {
    component.loadDefault();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ source: 'offline', data: {} });
  });
});
