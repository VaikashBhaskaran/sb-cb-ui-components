import { SearchSortInputComponent } from './search-sort-input.component';
import { fakeAsync, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { SEARCH_SORT_DROPDOWN, SEARCH_SORT_PEOPLES } from '../../_constants/search-listing.constant';
import { SearchCategory, SearchListingConfig, SortType } from '../../_models/search-listing.model';
import { SearchListingService } from '../../_services/search-listing.service';

describe('SearchSortInputComponent Additional Tests', () => {
  let component: SearchSortInputComponent;

  beforeEach(() => {
    // Create component directly instead of using TestBed
    component = new SearchSortInputComponent({} as SearchListingService);
  });

  describe('ngOnChanges', () => {
    const values = () => component.options.map(option => option.value);

    it('should use people sort options for the people category', async () => {
      component.category = SearchCategory.People;
      await component.ngOnChanges();
      expect(component.options).toEqual(SEARCH_SORT_PEOPLES);
      expect(component.selectedOption).toBe(SortType.MostRelevent);
    });

    it('should drop highest rated for categories without ratings', async () => {
      for (const category of [SearchCategory.Communities, SearchCategory.Events, SearchCategory.Users,
        SearchCategory.TrainingPlans, SearchCategory.Designation]) {
        component.category = category;
        await component.ngOnChanges();
        expect(values()).not.toContain(SortType.HighestRated);
        expect(component.selectedOption).toBe(SortType.MostRelevent);
      }
    });

    it('should default external contents to recently added without relevance or rating', async () => {
      component.category = SearchCategory.ExternalContents;
      await component.ngOnChanges();
      expect(values()).not.toContain(SortType.HighestRated);
      expect(values()).not.toContain(SortType.MostRelevent);
      expect(component.selectedOption).toBe(SortType.RecentlyAdded);
    });

    it('should use all sort options for content categories', async () => {
      component.category = SearchCategory.Courses;
      await component.ngOnChanges();
      expect(component.options).toEqual(SEARCH_SORT_DROPDOWN);
      expect(component.selectedOption).toBe(SortType.MostRelevent);
    });

    it('should default the explore content tab to recently added without relevance', async () => {
      component.category = SearchCategory.Courses;
      component.isExploreContentTab = true;
      await component.ngOnChanges();
      expect(values()).not.toContain(SortType.MostRelevent);
      expect(component.selectedOption).toBe(SortType.RecentlyAdded);
    });

    it('should prefer configured sortings for the category', async () => {
      const configured = [{ name: 'A-Z', value: 'a-z' }] as any;
      component.category = SearchCategory.Courses;
      component.sortingsList = { [SearchCategory.Courses]: configured };
      await component.ngOnChanges();
      expect(component.options).toBe(configured);
    });

    it('should drop highest rated for the CBP portal when no sortings are configured', async () => {
      component.category = SearchCategory.Courses;
      component.applicationName = SearchListingConfig.ApplicationNames.CBPPortal;
      await component.ngOnChanges();
      expect(values()).not.toContain(SortType.HighestRated);
    });
  });

  it('should not adjust the select width when ngAfterViewInit is called', () => {
    // Arrange
    const spy = jest.spyOn(component, 'adjustSelectWidth');

    // Act
    component.ngAfterViewInit();

    // Assert
    expect(spy).not.toHaveBeenCalled();
  });

  it('should store and emit the selected option when onChange is called', () => {
    // Arrange
    const emitSpy = jest.spyOn(component.searchSorter, 'emit');
    const mockEvent = {
      target: { value: 'recently_added_newest' },
    } as unknown as Event;

    // Act
    component.onChange(mockEvent);

    // Assert
    expect(component.selectedOption).toBe('recently_added_newest');
    expect(emitSpy).toHaveBeenCalledWith('recently_added_newest');
  });

  it('should set the select width based on the selected option text', fakeAsync(() => {
    // Arrange
    const mockSelectElement = {
      options: [
        { textContent: 'Most Relevant' },
        { textContent: 'Latest First' },
        { textContent: 'Oldest First' },
      ],
      selectedIndex: 0,
      style: { width: '' },
    };

    component.sortSelect = { nativeElement: mockSelectElement } as ElementRef;

    // Mock DOM methods
    const originalCreateElement = document.createElement;
    const originalAppendChild = document.body.appendChild;
    const originalRemoveChild = document.body.removeChild;
    const originalGetComputedStyle = window.getComputedStyle;

    const mockSpan = {
      style: {} as any,
      textContent: '',
      getBoundingClientRect: jest.fn().mockReturnValue({ width: 100 }),
    };

    document.createElement = jest.fn().mockReturnValue(mockSpan);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    window.getComputedStyle = jest.fn().mockReturnValue({ font: 'Arial 12px' });

    // Act
    component.adjustSelectWidth();
    tick(0); // Advance timers

    // Assert
    expect(document.createElement).toHaveBeenCalledWith('span');
    expect(mockSpan.style.font).toBe('Arial 12px');
    expect(mockSpan.style.visibility).toBe('hidden');
    expect(mockSpan.style.position).toBe('absolute');
    expect(mockSpan.textContent).toBe('Most Relevant');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockSpan);
    expect(mockSpan.getBoundingClientRect).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockSpan);
    expect(mockSelectElement.style.width).toBe('140px'); // 100 + 40

    // Restore original DOM methods
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
    window.getComputedStyle = originalGetComputedStyle;
  }));

  it('should size the select to the currently selected option', fakeAsync(() => {
    // Arrange
    const mockSelectElement = {
      options: [
        { textContent: 'Most Relevant' },
        { textContent: 'Latest First' },
        { textContent: 'Oldest First' },
      ],
      selectedIndex: 2,
      style: { width: '' },
    };

    component.sortSelect = { nativeElement: mockSelectElement } as ElementRef;

    // Mock DOM methods
    const originalCreateElement = document.createElement;
    const originalAppendChild = document.body.appendChild;
    const originalRemoveChild = document.body.removeChild;
    const originalGetComputedStyle = window.getComputedStyle;

    const mockSpan = {
      style: {},
      textContent: '',
      getBoundingClientRect: jest.fn().mockReturnValue({ width: 110 }),
    };

    document.createElement = jest.fn().mockReturnValue(mockSpan);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    window.getComputedStyle = jest.fn().mockReturnValue({ font: 'Arial 12px' });

    // Act
    component.adjustSelectWidth();
    tick(0); // Advance timers

    // Assert
    expect(mockSpan.textContent).toBe('Oldest First');
    expect(mockSelectElement.style.width).toBe('150px'); // 110 + 40

    // Restore original DOM methods
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
    window.getComputedStyle = originalGetComputedStyle;
  }));
});
