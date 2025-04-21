import { TestBed } from '@angular/core/testing';

import { ComoLlegarService } from './como-llegar.service';

describe('ComoLlegarService', () => {
  let service: ComoLlegarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComoLlegarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
