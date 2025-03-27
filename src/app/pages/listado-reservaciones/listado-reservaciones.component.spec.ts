import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoReservacionesComponent } from './listado-reservaciones.component';

describe('ListadoReservacionesComponent', () => {
  let component: ListadoReservacionesComponent;
  let fixture: ComponentFixture<ListadoReservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoReservacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoReservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
