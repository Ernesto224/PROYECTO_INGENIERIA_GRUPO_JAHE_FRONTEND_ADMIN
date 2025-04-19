import { TestBed } from '@angular/core/testing';

import { EstadoHabitacionService } from './estado-habitacion.service';

describe('EstadoHabitacionService', () => {
  let service: EstadoHabitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoHabitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
