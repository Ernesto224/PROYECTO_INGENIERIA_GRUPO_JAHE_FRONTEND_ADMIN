import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioClientesComponent } from './inicio-clientes.component';

describe('InicioClientesComponent', () => {
  let component: InicioClientesComponent;
  let fixture: ComponentFixture<InicioClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
