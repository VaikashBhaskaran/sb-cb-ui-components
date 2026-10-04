import { TestBed } from '@angular/core/testing'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

import { ConfigResolverService } from './config-resolver.service'

describe('ConfigResolverService', () => {
  const instanceConfig: any = { details: { appName: 'test' } }

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ConfigurationsService, useValue: { instanceConfig } },
    ],
  }))

  it('should be created', () => {
    const service: ConfigResolverService = TestBed.inject(ConfigResolverService)
    expect(service).toBeTruthy()
  })

  it('should resolve with the instance config', done => {
    const service: ConfigResolverService = TestBed.inject(ConfigResolverService)
    service.resolve({} as any, {} as any).subscribe((result: any) => {
      expect(result).toEqual({ data: instanceConfig, error: null })
      done()
    })
  })
})
