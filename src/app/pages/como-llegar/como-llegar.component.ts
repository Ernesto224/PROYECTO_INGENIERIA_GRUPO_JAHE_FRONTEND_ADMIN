import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComoLlegarService } from '../../Core/services/ComoLlegarService/como-llegar.service';
import { DireccionDTO } from '../../Core/models/DireccionDTO';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
  ],
  templateUrl: './como-llegar.component.html',
  styleUrls: ['./como-llegar.component.css']
})
export class ComoLlegarComponent implements OnInit {
  private comoLlegarService = inject(ComoLlegarService);
  private formBuilder = inject(FormBuilder);

  readonly direccionActual = signal<DireccionDTO>({
    idDireccion: -1,
    descripcion: '',
  });

  formularioComoLlegar: FormGroup = this.formBuilder.group({
    idDireccion: [null],
    descripcion: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarInformacionDireccion();
  }

  cargarInformacionDireccion(): void {
    this.comoLlegarService.obtenerDatosComoLlegar().subscribe({
      next: (direccionObtenida) => {
        this.direccionActual.set(direccionObtenida);
        this.formularioComoLlegar.patchValue({
          idDireccion: direccionObtenida.idDireccion,
          descripcion: direccionObtenida.descripcion
        });
      },
      error: (error) => {
        console.error('Error al obtener la dirección', error);
        Swal.fire({
          icon: 'error',
          text: 'Error al cargar los datos',
          timer: 1500,
          showConfirmButton: false
        });
      },
    });
  }

  actualizarInformacion(): void {
    if (this.formularioComoLlegar.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Completa los campos requeridos!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la información?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaDireccion: DireccionDTO = {
          idDireccion: this.formularioComoLlegar.value.idDireccion,
          descripcion: this.formularioComoLlegar.value.descripcion
        };

        this.comoLlegarService.enviarNuevoTextoComoLlegar(nuevaDireccion).subscribe({
          next: (direccionActualizada) => {
            this.direccionActual.set(direccionActualizada);
            Swal.fire({
              icon: 'success',
              text: 'Información actualizada correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            Swal.fire({
              icon: 'error',
              text: 'Error al actualizar la información',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  cancelar(): void {
    Swal.fire({
      text: '¿Deseas descartar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargarInformacionDireccion(); // Vuelve a cargar los datos originales
      }
    });
  }
}