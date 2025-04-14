import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTipoHabitacionComponent } from './modificar-tipo-habitacion.component';

describe('ModificarTipoHabitacionComponent', () => {
  let component: ModificarTipoHabitacionComponent;
  let fixture: ComponentFixture<ModificarTipoHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarTipoHabitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarTipoHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
