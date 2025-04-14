import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarHabitacionComponent } from './administrar-habitacion.component';

describe('AdministrarHabitacionComponent', () => {
  let component: AdministrarHabitacionComponent;
  let fixture: ComponentFixture<AdministrarHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarHabitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
