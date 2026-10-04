import { TestBed } from '@angular/core/testing';

import { ConnectorService } from './connector.service';

describe('ConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ConnectorService]
  }));

  it('should be created', () => {
    const service: ConnectorService = TestBed.inject(ConnectorService);
    expect(service).toBeTruthy();
  });

  it('_drawLine should return a no-op line when the tree container is missing', () => {
    const service: ConnectorService = TestBed.inject(ConnectorService);
    const line = service._drawLine(document.createElement('div'), { target: 'none', targetType: 'id' });
    expect(line.path).toBeNull();
    expect(() => line.remove()).not.toThrow();
  });

  it('removeAllLines should remove lines and reset the connector map', async () => {
    const service: ConnectorService = TestBed.inject(ConnectorService);
    const line = jasmine.createSpyObj('line', ['remove']);
    service.updateConnectorsMap({ key: { lines: [{ line }] } });
    service.removeAllLines();
    expect(service.connectorMap).toEqual({});
    // removal happens inside an async forEach callback, after a microtask
    await Promise.resolve();
    expect(line.remove).toHaveBeenCalled();
  });

  it('repositionAllLines should call position on every line', () => {
    const service: ConnectorService = TestBed.inject(ConnectorService);
    const line = jasmine.createSpyObj('line', ['position']);
    service.updateConnectorsMap({ key: { lines: [{ line }] } });
    service.repositionAllLines();
    expect(line.position).toHaveBeenCalled();
  });
});
