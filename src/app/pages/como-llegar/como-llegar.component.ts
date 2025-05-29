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
  private service = inject(ComoLlegarService);
  private fb = inject(FormBuilder);

  readonly direccion = signal<DireccionDTO>({
    idDireccion: -1,
    descripcion: '',
  });

  formulario: FormGroup = this.fb.group({
    descripcion: [''],
  });

  ngOnInit(): void {
    this.obtenerInformacion();
  }

  obtenerInformacion(): void {
    this.service.obtenerDatosComoLlegar().subscribe({
      next: (data) => {
        this.direccion.set(data);
        this.formulario.patchValue({ descripcion: data.descripcion });
      },
      error: (error) => {
        console.error('Hubo un error', error);
      },
    });
  }

  actualizarInformacion(): void {
    if (this.formulario.invalid) {
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
    }).then((result) => {
      if (result.isConfirmed) {
        const direccionActualizada: DireccionDTO = {
          ...this.direccion(),
          descripcion: this.formulario.value.descripcion,
        };

        this.service
          .enviarNuevoTextoComoLlegar(direccionActualizada)
          .subscribe({
            next: (data) => {
              this.direccion.set(data);
              this.formulario.patchValue({ descripcion: data.descripcion });
              Swal.fire({
                icon: 'success',
                text: 'Descripción actualizada.',
                timer: 1500,
                showConfirmButton: false,
              });
            },
            error: (err) => {
              console.error(err);
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
    this.formulario.patchValue({ descripcion: this.direccion().descripcion });
  }
}
