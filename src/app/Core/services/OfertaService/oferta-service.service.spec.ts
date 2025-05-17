import { TestBed } from '@angular/core/testing';

import { OfertaServiceService } from './oferta-service.service';

describe('OfertaServiceService', () => {
  let service: OfertaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
