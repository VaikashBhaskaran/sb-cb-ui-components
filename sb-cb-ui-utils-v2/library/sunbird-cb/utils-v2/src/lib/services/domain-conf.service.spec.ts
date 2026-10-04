import { TestBed } from '@angular/core/testing'

import { ConfigurationsService } from './configurations.service'
import { DomainConfService } from './domain-conf.service'

const IIIDEM = 'iiidem-portal'

/** Minimal ConfigurationsService stand-in: only the two config sources matter here. */
class MockConfigurationsService {
  globalConfig: any = {}
  instanceConfig: any = null
}

describe('DomainConfService', () => {
  let service: DomainConfService
  let configSvc: MockConfigurationsService

  const environment = {
    logo: '/assets/instances/eagle/app_logos/env-logo.svg',
    redirectPath: '/page/home',
    sitePath: 'portal.igotkarmayogi.gov.in',
    cdnContentHost: 'https://portal.igotkarmayogi.gov.in',
    karmayogiBharatLink: 'https://igotkarmayogi.gov.in/',
  }

  /** Loads the tenant registry the way InitService does, after construction. */
  const withRegistry = (tenants: any) => {
    configSvc.globalConfig = { applicationConfig: { tenants } }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DomainConfService,
        { provide: ConfigurationsService, useClass: MockConfigurationsService },
        { provide: 'environment', useValue: environment },
      ],
    })
    service = TestBed.inject(DomainConfService)
    configSvc = TestBed.inject(ConfigurationsService) as any
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('resolveTenant', () => {
    it('resolves a {tenant}-portal host to that tenant', () => {
      expect(service.resolveTenant('iiidem-portal.igotkarmayogi.gov.in')).toBe(IIIDEM)
      expect(service.resolveTenant('iiidem-portal.qa.karmayogibharat.net')).toBe(IIIDEM)
    })

    // The label-counting rule this replaces resolved the live prod portal to the
    // tenant 'igotkarmayogi', because portal.igotkarmayogi.gov.in has four labels.
    it('resolves the main portal host to "portal", whatever the base domain', () => {
      withRegistry({ [IIIDEM]: {}, mauritius: {} })
      expect(service.resolveTenant('portal.igotkarmayogi.gov.in')).toBe('portal')
      expect(service.resolveTenant('portal.qa.karmayogibharat.net')).toBe('portal')
    })

    it('treats portal.{tenant}.* as a tenant only when the tenant is registered', () => {
      withRegistry({ mauritius: {} })
      expect(service.resolveTenant('portal.mauritius.karmayogibharat.net')).toBe('mauritius')
      expect(service.resolveTenant('portal.unknown.karmayogibharat.net')).toBe('portal')
    })

    it('accepts a tenant registered only in the legacy domainList', () => {
      configSvc.instanceConfig = { domainList: { mauritius: { logo: '/m.svg' } } }
      expect(service.resolveTenant('portal.mauritius.karmayogibharat.net')).toBe('mauritius')
    })

    it('resolves every dev host to the "localhost" tenant key', () => {
      withRegistry({ [IIIDEM]: {}, localhost: {} })
      expect(service.resolveTenant('localhost')).toBe('localhost')
      expect(service.resolveTenant('127.0.0.1')).toBe('localhost')
    })

    // No default tenant: a host is never served another tenant's branding.
    it('keeps an unregistered host on "portal"', () => {
      withRegistry({ [IIIDEM]: {} })
      expect(service.resolveTenant('portal.igotkarmayogi.gov.in')).toBe('portal')
      expect(service.resolveTenant('portal.unknown.karmayogibharat.net')).toBe('portal')
    })

    it('resolves each tenant host to its own key', () => {
      withRegistry({ [IIIDEM]: {}, 'adikarmayogi-portal': {} })
      expect(service.resolveTenant('iiidem-portal.igotkarmayogi.gov.in')).toBe(IIIDEM)
      expect(service.resolveTenant('adikarmayogi-portal.igotkarmayogi.gov.in'))
        .toBe('adikarmayogi-portal')
    })
  })

  describe('getTenantConfig', () => {
    it('layers the registry entry over the defaults and merges features', () => {
      withRegistry({
        localhost: {
          type: 'internal',
          logo: '/assets/iiidem.png',
          redirectPath: '/page/custom-home/iiidem',
          features: { network: false, discussion: false },
        },
      })
      const config = service.getTenantConfig()
      expect(config.type).toBe('internal')
      expect(config.logo).toBe('/assets/iiidem.png')
      expect(config.redirectPath).toBe('/page/custom-home/iiidem')
      expect(service.isFeatureEnabled('network')).toBe(false)
      // untouched defaults survive the merge
      expect(config.layout).toBe('default')
      expect(service.isFeatureEnabled('events')).toBe(true)
      expect(config.cdnContentHost).toBe(environment.cdnContentHost)
    })

    it('returns the defaults when the tenant has no entry', () => {
      withRegistry({ 'other-portal': { logo: '/other.png' } })
      expect(service.getTenantConfig().logo).toBe(environment.logo)
    })

    it('ignores empty registry values instead of blanking a default', () => {
      withRegistry({ localhost: { cdnContentHost: '' } })
      expect(service.getTenantConfig().cdnContentHost).toBe(environment.cdnContentHost)
    })
  })

  // "if the local entry is not there, the default has to come from env"
  describe('environment fallback when the tenant has no entry', () => {
    it('serves the environment logo, redirect path, CDN host and KB link', () => {
      withRegistry({ [IIIDEM]: { logo: '/iiidem.png' } })   // no localhost entry
      expect(service.subdomain).toBe('localhost')
      expect(service.getDomainAppLogo()).toBe(environment.logo)
      expect(service.getDomainRedirectPath()).toBe(environment.redirectPath)
      expect(service.getDomainCDNHost()).toBe(environment.cdnContentHost)
      expect(service.getNonLoggedInPageUrl()).toBe(environment.karmayogiBharatLink)
    })

    it('prefers the instance app logo over the environment logo', () => {
      configSvc.instanceConfig = { logos: { app: '/instance-app.svg' } }
      expect(service.getDomainAppLogo()).toBe('/instance-app.svg')
    })

    it('uses the built-in logo only when nothing else is configured', () => {
      const bare = new (DomainConfService as any)({ globalConfig: {}, instanceConfig: null }, {})
      expect(bare.getDomainAppLogo()).toBe(bare.defaultLogo)
    })
  })

  describe('getSessionOrigin', () => {
    // /apis/reset only clears the session on the host holding the cookie, so on a
    // real host the reset target is the live origin and never a configured hostname.
    it('uses the live origin on a real host', () => {
      const svc: any = service
      svc.isDevHost = () => false
      expect(service.getSessionOrigin()).toBe(window.location.origin)
    })

    it('falls back to the configured site path on a dev host', () => {
      withRegistry({ localhost: { sitePath: 'iiidem-portal.qa.karmayogibharat.net' } })
      const svc: any = service
      svc.isDevHost = () => true
      expect(service.getSessionOrigin()).toBe('https://iiidem-portal.qa.karmayogibharat.net')
    })
  })
})
