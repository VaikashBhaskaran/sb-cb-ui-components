import { HttpClient } from '@angular/common/http'
import { EventService, WsEvents } from '@sunbird-cb/utils'
import { NsContent, WidgetContentService } from '@sunbird-cb/collection'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
import { HandsOnComponent } from './hands-on.component'
import { of } from 'rxjs'

describe('HandsOnComponent', () => {
    let component: HandsOnComponent

    const mockEventSvc: Partial<EventService> = {
        dispatchEvent: jasmine.createSpy(),
    }

    const mockActivatedRoute: Partial<ActivatedRoute> = {
        data: of({
            content: {
                data: {
                    identifier: 'test-id',
                    artifactUrl: 'test-url',
                    mimeType: NsContent.EMimeTypes.HANDS_ON,
                },
            },
        }),
        snapshot: {
            queryParams: {
                collectionId: 'test-collection',
                collectionType: 'test-type',
            },
            url: [],
            params: {},
            fragment: '',
            data: {},
            outlet: '',
            component: null,
            routeConfig: null,
            root: new ActivatedRouteSnapshot,
            parent: new ActivatedRouteSnapshot,
            firstChild: new ActivatedRouteSnapshot,
            children: [],
            pathFromRoot: [],
            paramMap: undefined as any,
            queryParamMap: undefined as any
        } as any,
    }

    const mockContentSvc: Partial<WidgetContentService> = {
        continueLearning: jasmine.createSpy().and.resolveTo(undefined),
        setS3Cookie: jasmine.createSpy().and.returnValue(of({})),
    }

    const mockHttp: Partial<HttpClient> = {
        get: jasmine.createSpy().and.returnValue(of({ manifestData: 'test' })),
    }

    const mockViewSvc: Partial<ViewerUtilService> = {
        getAuthoringUrl: jasmine.createSpy().and.returnValue('test-author-url'),
    }

    beforeEach(() => {
        // the mocks are shared across tests, so clear their call history
        [mockEventSvc, mockContentSvc, mockHttp, mockViewSvc].forEach(mock =>
            Object.values(mock).forEach(fn => jasmine.isSpy(fn) && (fn as jasmine.Spy).calls.reset()))
        component = new HandsOnComponent(
            mockEventSvc as EventService,
            mockActivatedRoute as ActivatedRoute,
            mockContentSvc as WidgetContentService,
            mockHttp as HttpClient,
            mockViewSvc as ViewerUtilService
        )
    })

    it('should create an instance of component', () => {
        expect(component).toBeTruthy()
    })

    describe('ngOnInit', () => {
        it('should initialize component with hands-on data', async () => {
            await component.ngOnInit()
            expect(component.isFetchingDataComplete).toBe(false)
            expect(component.isErrorOccured).toBe(false)
            expect(component.handsOnData).toBeTruthy()
        })

        it('should set S3 cookie when artifactUrl contains content-store', async () => {
            const contentWithStore = {
                content: {
                    data: {
                        identifier: 'test-id',
                        artifactUrl: 'content-store/test-url',
                        mimeType: NsContent.EMimeTypes.HANDS_ON,
                    },
                },
            }
            mockActivatedRoute.data = of(contentWithStore)

            await component.ngOnInit()
            expect(mockContentSvc.setS3Cookie).toHaveBeenCalledWith('test-id')
        })

        it('should handle error when manifest fetch fails', async () => {
            mockHttp.get = jasmine.createSpy().and.returnValue(of(null))
            await component.ngOnInit()
            expect(component.isErrorOccured).toBe(false)
        })
    })

    describe('ngOnDestroy', () => {
        beforeEach(async () => {
            await component.ngOnInit()
        })

        it('should call continueLearning with collection params when available', async () => {
            await component.ngOnDestroy()
            expect(mockContentSvc.continueLearning).toHaveBeenCalledWith(
                'test-id',
                'test-collection',
                'test-type'
            )
        })

        it('should call continueLearning without collection params when not available', async () => {
            await component.ngOnDestroy()
            expect(mockContentSvc.continueLearning).toHaveBeenCalledWith('test-id',
                'test-collection',
                'test-type')
        })

        it('should raise unload event', async () => {
            await component.ngOnDestroy()
            expect(mockEventSvc.dispatchEvent).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventType: WsEvents.WsEventType.Telemetry,
                    data: jasmine.objectContaining({
                        state: WsEvents.EnumTelemetrySubType.Unloaded,
                    }),
                })
            )
        })
    })

    describe('raiseEvent', () => {
        it('should dispatch telemetry event with correct data', () => {
            const testContent: NsContent.IContent = {
                identifier: 'test-id',
                artifactUrl: 'test-url',
                mimeType: NsContent.EMimeTypes.HANDS_ON,
            } as NsContent.IContent

            component.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, testContent)

            expect(mockEventSvc.dispatchEvent).toHaveBeenCalledWith({
                eventType: WsEvents.WsEventType.Telemetry,
                eventLogLevel: WsEvents.WsEventLogLevel.Info,
                from: 'hands-on',
                to: '',
                data: {
                    state: WsEvents.EnumTelemetrySubType.Loaded,
                    type: WsEvents.WsTimeSpentType.Player,
                    mode: WsEvents.WsTimeSpentMode.Play,
                    content: testContent,
                    identifier: testContent.identifier,
                    mimeType: NsContent.EMimeTypes.HANDS_ON,
                    url: testContent.artifactUrl,
                },
            })
        })

        it('should handle null content in event data', () => {
            component.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, null as any)

            expect(mockEventSvc.dispatchEvent).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    data: jasmine.objectContaining({
                        identifier: null,
                        url: null,
                    }),
                })
            )
        })
    })
})