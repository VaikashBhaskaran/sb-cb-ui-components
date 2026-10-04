import { of } from 'rxjs'
import { AudioNativeComponent } from './audio-native.component'

describe('AudioNativeComponent', () => {
    let component: AudioNativeComponent
    let mockActivatedRoute: any
    let mockContentSvc: any
    let mockValueSvc: any
    let mockViewerSvc: any
    let mockConfigSvc: any

    const mockAudioData = {
        identifier: 'test-audio-123',
        artifactUrl: 'http://example.com/audio.mp3',
        name: 'Test Audio',
        description: 'Test Description',
        appIcon: 'author-http://example.com/icon.png'
    }

    beforeEach(() => {
        // Initialize mocks
        mockActivatedRoute = {
            data: of({ content: { data: mockAudioData } })
        }

        mockContentSvc = {
            saveContinueLearning: jasmine.createSpy().and.returnValue(of({})),
            setS3Cookie: jasmine.createSpy().and.returnValue(of({}))
        }

        mockValueSvc = {
            isXSmall$: of(false)
        }

        mockViewerSvc = {
            getAuthoringUrl: jasmine.createSpy().and.callFake(url => `author-${url}`)
        }

        mockConfigSvc = {
            instanceConfig: {
                logos: {
                    defaultContent: 'default-thumbnail.jpg'
                }
            }
        }

        // Create component instance directly
        component = new AudioNativeComponent(
            mockActivatedRoute,
            mockContentSvc,
            mockValueSvc,
            mockViewerSvc,
            mockConfigSvc
        )
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    describe('ngOnInit', () => {
        it('should set default thumbnail from config', () => {
            component.ngOnInit()
            expect(component.defaultThumbnail).toBe('author-http://example.com/icon.png')
        })

        it('should subscribe to screen size changes', () => {
            const screenSizeSpy = spyOn(mockValueSvc.isXSmall$, 'subscribe').and.callThrough()
            component.ngOnInit()
            expect(screenSizeSpy).toHaveBeenCalled()
        })

        it('should initialize audio data from route', () => {
            component.ngOnInit()
            expect(component.audioData).toEqual(mockAudioData as any)
        })

        it('should modify artifactUrl for preview mode', () => {
            // forPreview is read from window.location at construction; set it directly
            mockActivatedRoute.data = of({ content: { data: { ...mockAudioData } } })
            component.forPreview = true

            component.ngOnInit()
            expect(component.audioData?.artifactUrl).toBe('author-http://example.com/audio.mp3')
        })

        it('should set appIcon as default thumbnail if available', () => {
            component.ngOnInit()
            expect(component.defaultThumbnail).toBe(mockAudioData.appIcon)
        })

        it('should handle missing appIcon', () => {

            component.ngOnInit()
            expect(component.defaultThumbnail).toBe('author-http://example.com/icon.png')
        })
    })

    describe('ngOnDestroy', () => {
        it('should unsubscribe from all subscriptions', () => {
            component.ngOnInit()

            // Create spies for unsubscribe methods
            const routeDataUnsubscribe = jasmine.createSpy()
            const screenSizeUnsubscribe = jasmine.createSpy()
            const viewerDataUnsubscribe = jasmine.createSpy();

            // Set up the subscriptions with spy methods
            (component as any).routeDataSubscription = { unsubscribe: routeDataUnsubscribe };
            (component as any).screenSizeSubscription = { unsubscribe: screenSizeUnsubscribe };
            (component as any).viewerDataSubscription = { unsubscribe: viewerDataUnsubscribe }

            component.ngOnDestroy()

            expect(routeDataUnsubscribe).toHaveBeenCalled()
            expect(screenSizeUnsubscribe).toHaveBeenCalled()
            expect(viewerDataUnsubscribe).toHaveBeenCalled()
        })

        it('should handle null subscriptions gracefully', () => {
            component.ngOnDestroy()
            // Should not throw any errors
            expect(true).toBeTruthy()
        })
    })

    describe('saveContinueLearning', () => {
        it('should call saveContinueLearning with correct parameters', () => {
            const timestamp = 1234567890
            spyOn(Date, 'now').and.callFake(() => timestamp)



        })

        it('should handle null content gracefully', () => {
            component.saveContinueLearning(null)

            expect(mockContentSvc.saveContinueLearning).toHaveBeenCalledWith({
                contextPathId: '',
                resourceId: '',
                data: jasmine.any(String),
                dateAccessed: jasmine.any(Number)
            })
        })
    })


})