import { TestBed } from '@angular/core/testing';

import { TipoHabitacionesService } from './tipo-habitaciones.service';

describe('TipoHabitacionesService', () => {
  let service: TipoHabitacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoHabitacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
