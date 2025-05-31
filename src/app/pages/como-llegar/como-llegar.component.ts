import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComoLlegarService } from '../../Core/services/ComoLlegarService/como-llegar.service';
import { DireccionDTO } from '../../Core/models/DireccionDTO';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-como-llegar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './como-llegar.component.html',
  styleUrl: './como-llegar.component.css',
})
export class ComoLlegarComponent implements OnInit {
  private comoLlegarService = inject(ComoLlegarService);
  private formBuilder = inject(FormBuilder);

  readonly direccionActual = signal<DireccionDTO>({
    idDireccion: -1,
    descripcion: '',
  });

  formularioComoLlegar: FormGroup = this.formBuilder.group({
    descripcion: [''],
  });

  ngOnInit(): void {
    this.cargarInformacionDireccion();
  }

  cargarInformacionDireccion(): void {
    this.comoLlegarService.obtenerDatosComoLlegar().subscribe({
      next: (direccionObtenida) => {
        this.direccionActual.set(direccionObtenida);
        this.formularioComoLlegar.patchValue({ descripcion: direccionObtenida.descripcion });
      },
      error: (error) => {
        console.error('Error al obtener la dirección', error);
      },
    });
  }

  actualizarInformacion(): void {
    if (this.formularioComoLlegar.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'La descripción es requerida.',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la descripción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((resultadoConfirmacion) => {
      if (resultadoConfirmacion.isConfirmed) {
        const nuevaDireccion: DireccionDTO = {
          ...this.direccionActual(),
          descripcion: this.formularioComoLlegar.value.descripcion,
        };

        this.comoLlegarService.enviarNuevoTextoComoLlegar(nuevaDireccion).subscribe({
          next: (direccionActualizada) => {
            this.direccionActual.set(direccionActualizada);
            this.formularioComoLlegar.patchValue({ descripcion: direccionActualizada.descripcion });
            Swal.fire({
              icon: 'success',
              text: 'Descripción actualizada.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (errorActualizacion) => {
            console.error('Error al actualizar la descripción', errorActualizacion);
            Swal.fire({
              icon: 'error',
              text: 'Error al actualizar.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }

  cancelar(): void {
    this.formularioComoLlegar.reset({ descripcion: this.direccionActual().descripcion });
  }
}
