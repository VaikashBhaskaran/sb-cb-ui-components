import { GlobalSearchComponent } from './global-search.component';
import { ParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let mockActivatedRoute: any;
  let mockTranslateService: any;
  let mockConfigService: any;
  let mockRouter: any;
  let originalLocalStorage: Storage;
  let mockSearchListingService: any;
  let mockEnvironment: any;

  // Helper function to create paramMap from object
  const createParamMap = (params: any): ParamMap => {
    return {
      has: (name: string): boolean => Object.prototype.hasOwnProperty.call(params, name),
      get: (name: string): string | null => params[name] || null,
      getAll: (name: string): string[] => params[name] ? [params[name]] : [],
      keys: Object.keys(params)
    };
  };

  // Store original localStorage before tests
  beforeAll(() => {
    originalLocalStorage = global.localStorage;
  });

  // Restore original localStorage after tests
  afterAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage
    });
  });

  // Set up the mocks before each test
  beforeEach(() => {
    // Mock LocalStorage
    const localStorageMock = (function() {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key: string) => {
          return store[key] || null;
        }),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();
    
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock
    });

    // Mock environment (injected via the 'environment' token)
    mockEnvironment = {
      compentencyVersionKey: 'v3'
    };

    // Mock services
    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
      instant: jest.fn((key) => key), // Return the key as the translation
    };

    mockConfigService = {
      compentency: {
        v3: { /* mock compentency data */ }
      }
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockActivatedRoute = {
      queryParamMap: of(createParamMap({})), // Default empty params
      parent: {},
    };

    mockSearchListingService = {
      getSearchConfig: jest.fn().mockResolvedValue({ applicationName: 'Learner Portal' }),
    };

    // Create component instance
    component = new GlobalSearchComponent(
      mockEnvironment,
      mockActivatedRoute,
      mockTranslateService,
      mockConfigService,
      mockRouter,
      mockSearchListingService
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set language from localStorage', () => {
    // Arrange
    jest.clearAllMocks(); // Clear any previous calls
    localStorage.setItem('websiteLanguage', 'hi');
    
    // Act
    component = new GlobalSearchComponent(
      mockEnvironment,
      mockActivatedRoute,
      mockTranslateService,
      mockConfigService,
      mockRouter,
      mockSearchListingService
    );
    
    // Assert
    expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(mockTranslateService.use).toHaveBeenCalledWith('hi');
  });

  it('should not set language if not in localStorage', () => {
    // Arrange
    jest.clearAllMocks(); // Clear any previous calls
    localStorage.removeItem('websiteLanguage');
    
    // Act
    component = new GlobalSearchComponent(
      mockEnvironment,
      mockActivatedRoute,
      mockTranslateService,
      mockConfigService,
      mockRouter,
      mockSearchListingService
    );
    
    // Assert
    expect(mockTranslateService.setDefaultLang).not.toHaveBeenCalled();
    expect(mockTranslateService.use).not.toHaveBeenCalled();
  });

  it('should set compentencyKey from configService', async () => {
    // Act
    await component.ngOnInit();
    
    // Assert - Make sure environment is properly set up
    expect(component.environment.compentencyVersionKey).toBe('v3');
    expect(mockConfigService.compentency.v3).toBeDefined();
    expect(component.compentencyKey).toBe(mockConfigService.compentency.v3);
  });

  it('should update searchParam when query param "q" is present', async () => {
    // Arrange
    mockActivatedRoute.queryParamMap = of(createParamMap({
      q: 'search-term',
      search: 'nlp-value',
      category: 'category-value'
    }));

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.searchParam).toEqual({
      query: 'search-term',
      nlp: 'nlp-value',
      searchCategory: 'category-value'
    });
  });

  it('should update searchParam when query param "t" is present', async () => {
    // Arrange
    mockActivatedRoute.queryParamMap = of(createParamMap({
      t: 'something',
      search: 'nlp-value',
      category: 'category-value'
    }));

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.searchParam).toEqual({
      query: 'moderatedCourses',
      nlp: 'nlp-value',
      searchCategory: 'category-value'
    });
    expect(component.userValue).toBe('moderatedCourses');
  });

  it('should update selectedTab when "tab" query param is present', async () => {
    // Arrange
    mockActivatedRoute.queryParamMap = of(createParamMap({
      tab: 'Network'
    }));

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.selectedTab).toBe(2); // Index of 'Network' in the tabs array
  });

  it('should set searchparamFilters when "f" query param is present', async () => {
    // Arrange
    const filterJSON = JSON.stringify({
      primaryCategory: 'Course',
      contentType: ['Course'],
      'competencies_v3.name': ['comp1', 'comp2'],
      'topics': ['topic1', 'topic2']
    });
    
    mockActivatedRoute.queryParamMap = of(createParamMap({
      f: filterJSON
    }));

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.searchparamFilters).toEqual([
      {
        mainType: 'course',
        subType: 'Course',
      },
    ]);
  });

  it('should set filtersPanel when query param is present', async () => {
    // Arrange
    mockActivatedRoute.queryParamMap = of(createParamMap({
      filtersPanel: 'panel1'
    }));

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.filtersPanel).toBe('panel1');
  });

  it('should translate correctly using the translateService', () => {
    // Arrange
    mockTranslateService.instant.mockReturnValue('Translated Text');
    
    // Act
    const result = component.translateTo('Menu Name');
    
    // Assert
    expect(mockTranslateService.instant).toHaveBeenCalledWith('globalsearch.MenuName');
    expect(result).toBe('Translated Text');
  });

  it('should call router.navigate with correct params when filterSelectcategory is called', () => {
    // Arrange
    const queryParams = { category: 'Learning' };
    
    // Act
    component.filterSelectcategory(queryParams);
    
    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: mockActivatedRoute.parent,
        queryParams,
        queryParamsHandling: 'merge'
      }
    );
  });
});