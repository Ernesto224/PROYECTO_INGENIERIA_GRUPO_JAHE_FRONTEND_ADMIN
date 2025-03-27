import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDisponibilidadHabitacionesComponent } from './consultar-disponibilidad-habitaciones.component';

describe('ConsultarDisponibilidadHabitacionesComponent', () => {
  let component: ConsultarDisponibilidadHabitacionesComponent;
  let fixture: ComponentFixture<ConsultarDisponibilidadHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarDisponibilidadHabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarDisponibilidadHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
