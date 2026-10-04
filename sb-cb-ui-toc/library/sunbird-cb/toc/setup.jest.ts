import '@angular/localize/init';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// jsdom has no canvas; jspdf probes it at import time
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: () => null });
