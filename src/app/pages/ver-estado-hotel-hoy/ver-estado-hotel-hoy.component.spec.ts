import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEstadoHotelHoyComponent } from './ver-estado-hotel-hoy.component';

describe('VerEstadoHotelHoyComponent', () => {
  let component: VerEstadoHotelHoyComponent;
  let fixture: ComponentFixture<VerEstadoHotelHoyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEstadoHotelHoyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEstadoHotelHoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
