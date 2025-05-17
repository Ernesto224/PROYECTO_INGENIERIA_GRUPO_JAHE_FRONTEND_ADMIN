import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModificarOfertaComponent } from './modal-modificar-oferta.component';

describe('ModalModificarOfertaComponent', () => {
  let component: ModalModificarOfertaComponent;
  let fixture: ComponentFixture<ModalModificarOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalModificarOfertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalModificarOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
