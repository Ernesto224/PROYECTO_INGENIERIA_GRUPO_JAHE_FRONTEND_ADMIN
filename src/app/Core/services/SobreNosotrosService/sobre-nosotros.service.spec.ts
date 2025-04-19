import { TestBed } from '@angular/core/testing';

import { SobreNosotrosService } from './sobre-nosotros.service';

describe('SobreNosotrosService', () => {
  let service: SobreNosotrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SobreNosotrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
