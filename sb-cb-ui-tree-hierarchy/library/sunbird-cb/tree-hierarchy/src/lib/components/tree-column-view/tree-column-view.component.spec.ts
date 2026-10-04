import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ConnectorService } from '../../services/connector.service';
import { FrameworkService } from '../../services/framework.service';
import { TreeColumnViewComponent } from './tree-column-view.component';

describe('TreeColumnViewComponent', () => {
  let component: TreeColumnViewComponent;
  let fixture: ComponentFixture<TreeColumnViewComponent>;
  let frameworkService: FrameworkService;
  let cardsCountEvents: any[];

  function buildColumn() {
    return {
      code: 'board',
      index: 1,
      name: 'Board',
      config: { showSearch: true },
      children: [
        { identifier: 'a', code: 'a', name: 'Alpha', category: 'board', additionalProperties: { timeStamp: '1000' } },
        { identifier: 'b', code: 'b', name: 'Beta', category: 'board', description: 'second', additionalProperties: { timeStamp: '3000' } },
        { identifier: 'c', code: 'c', name: 'Gamma', category: 'board', additionalProperties: { timeStamp: '2000' } },
      ],
    };
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeColumnViewComponent ],
      imports: [ ReactiveFormsModule ],
      // ConnectorService is not providedIn root; TreeHierarchyModule provides it
      providers: [ provideHttpClient(), provideHttpClientTesting(), ConnectorService ],
      // lib-term-card and mat-icon are rendered as children; they are covered by their own specs
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    frameworkService = TestBed.inject(FrameworkService);
    fixture = TestBed.createComponent(TreeColumnViewComponent);
    component = fixture.componentInstance;
    component.column = buildColumn();
    cardsCountEvents = [];
    component.cardsCount.subscribe(e => cardsCountEvents.push(e));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build first column data sorted by newest timestamp and emit the count', () => {
    expect(component.columnData.map(c => c.identifier)).toEqual(['b', 'c', 'a']);
    expect(component.columnItems.length).toBe(3);
    expect(cardsCountEvents).toEqual([{ category: 'board', count: 3 }]);
  });

  it('should render one card per column item', () => {
    expect(fixture.nativeElement.querySelectorAll('lib-term-card').length).toBe(3);
    expect(fixture.nativeElement.querySelector('#boardCard1')).toBeTruthy();
  });

  it('should filter column items by the search value', () => {
    component.searchValue.setValue('second');
    component.setColumnItems();
    expect(component.columnItems.map((c: any) => c.identifier)).toEqual(['b']);
    component.searchValue.setValue('');
    component.setColumnItems();
    expect(component.columnItems.length).toBe(3);
  });

  it('should disable load more when all filtered items are shown', () => {
    expect(component.disableLoadButton).toBe(true);
    component.currentLastIndex = 2;
    expect(component.disableLoadButton).toBe(false);
  });

  it('should show the load more button for non-organisation columns with items', () => {
    expect(component.showLoadMoreBtn).toBe(true);
    component.column.config.categoryDisplayName = 'Organisation';
    expect(component.showLoadMoreBtn).toBe(false);
  });

  it('should emit updateTaxonomyTerm and mark the selected item when its column is selected', () => {
    spyOn(component.updateTaxonomyTerm, 'emit');
    const cardRef = document.createElement('div');
    frameworkService.currentSelection.next({ type: 'board', data: { code: 'c', name: 'Gamma' }, cardRef });

    expect(component.updateTaxonomyTerm.emit).toHaveBeenCalledWith({
      isSelected: true, selectedTerm: { code: 'c', name: 'Gamma', cardRef },
    } as any);
    expect(component.columnData.filter(c => c.selected).map(c => c.code)).toEqual(['c']);
  });

  it('should pass isUpdate through when the selection is an update', () => {
    spyOn(component.updateTaxonomyTerm, 'emit');
    frameworkService.currentSelection.next({ type: 'board', data: { code: 'a' }, cardRef: null, isUpdate: true });
    expect(component.updateTaxonomyTerm.emit).toHaveBeenCalledWith(jasmine.objectContaining({ isSelected: true, isUpdate: true }));
  });

  it('should re-emit selected card events as updateTermList', () => {
    spyOn(component.updateTermList, 'emit');
    const event = { term: { identifier: 'a' }, checked: true };
    component.selectedCard(event);
    expect(component.updateTermList.emit).toHaveBeenCalledWith(event as any);
  });

  it('should re-emit card actions', () => {
    spyOn(component.cardAction, 'emit');
    const event = { action: 'manage-org', data: {} };
    component.cardActionEmit(event);
    expect(component.cardAction.emit).toHaveBeenCalledWith(event as any);
  });

  it('should detect existing terms by identifier', () => {
    expect(component.isExists({ identifier: 'a' })).toBe(true);
    expect(component.isExists({ identifier: 'z' })).toBe(false);
  });

  it('should unsubscribe from framework events on destroy', () => {
    fixture.destroy();
    expect(component.childSubscription!.closed).toBe(true);
    expect(component.newTermSubscription!.closed).toBe(true);
  });
});
