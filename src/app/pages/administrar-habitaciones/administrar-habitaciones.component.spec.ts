import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarHabitacionesComponent } from './administrar-habitaciones.component';

describe('AdministrarHabitacionesComponent', () => {
  let component: AdministrarHabitacionesComponent;
  let fixture: ComponentFixture<AdministrarHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarHabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
