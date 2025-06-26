import { TestBed } from '@angular/core/testing';

import { TemporadaServiceService } from './temporada-service.service';

describe('TemporadaServiceService', () => {
  let service: TemporadaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporadaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
