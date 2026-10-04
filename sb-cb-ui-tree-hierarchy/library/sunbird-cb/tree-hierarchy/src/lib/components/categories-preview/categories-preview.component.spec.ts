import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { CategoriesPreviewComponent } from './categories-preview.component';

describe('CategoriesPreviewComponent', () => {
  let component: CategoriesPreviewComponent;
  let fixture: ComponentFixture<CategoriesPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesPreviewComponent ],
      imports: [ MatCardModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPreviewComponent);
    component = fixture.componentInstance;
    component.data = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a column per category and a card per term', () => {
    component.data = [
      { name: 'Cat A', terms: [{ name: 'Term 1', domId: 'a1' }, { name: 'Term 2', domId: 'a2' }] },
      { name: 'Cat B', terms: [{ name: 'Term 3', domId: 'b1' }] }
    ];
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.category__column').length).toBe(2);
    expect(el.querySelectorAll('mat-card').length).toBe(3);
    expect(el.querySelector('#a2')?.textContent).toContain('Term 2');
  });

  it('drawLine should not create lines for unconnected terms', () => {
    component.data = [{ name: 'Cat A', terms: [{ name: 'Term 1', domId: 'a1' }] }];
    component.drawLine();
    expect(component.lineRef).toEqual([]);
  });
});
