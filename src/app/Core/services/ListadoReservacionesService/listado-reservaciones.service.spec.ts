import { TestBed } from '@angular/core/testing';

import { ListadoReservacionesService } from './listado-reservaciones.service';

describe('ListadoReservacionesService', () => {
  let service: ListadoReservacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListadoReservacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
