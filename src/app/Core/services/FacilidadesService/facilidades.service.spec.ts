import { TestBed } from '@angular/core/testing';

import { FacilidadesService } from './facilidades.service';

describe('FacilidadesService', () => {
  let service: FacilidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
