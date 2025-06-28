import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

import { SobreNosotrosService } from '../../Core/services/SobreNosotrosService/sobre-nosotros.service';
import { SobreNosotrosDTO } from '../../Core/models/SobreNosotrosDTO';
import { GaleriaModificarDTO } from '../../Core/models/GaleriaModificarDTO';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent implements OnInit {
  private formularioBuilder = inject(FormBuilder);
  private sobreNosotrosServicio = inject(SobreNosotrosService);

  formularioSobreNosotros: FormGroup;
  datosSobreNosotros!: SobreNosotrosDTO;
  idImagenSeleccionada: number | null = null;
  urlImagenSeleccionada: string = '';
  imagenSeleccionadaEnBase64: string | null = null;
  nombreArchivoImagenSeleccionada: string = '';

  constructor() {
    this.formularioSobreNosotros = this.formularioBuilder.group({
      idSobreNosotros: [null],
      descripcion: ['', [Validators.required]],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerDatosSobreNosotros();
  }

  obtenerDatosSobreNosotros(): void {
    this.sobreNosotrosServicio.obtenerDatosSobreNosotros().subscribe({
      next: (respuesta) => {
        this.datosSobreNosotros = respuesta;
        this.formularioSobreNosotros.patchValue({
          idSobreNosotros: respuesta.idSobreNosotros,
          descripcion: respuesta.descripcion
        });
      },
      error: (error) => {
        console.error('Error al obtener información:', error);
        Swal.fire({
          icon: 'error',
          text: 'Error al cargar los datos',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  actualizarDescripcion(): void {
    if (this.formularioSobreNosotros.invalid) {
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
      text: '¿Deseas actualizar la descripción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const datosActualizados: SobreNosotrosDTO = {
          ...this.datosSobreNosotros,
          descripcion: this.formularioSobreNosotros.value.descripcion
        };

        this.sobreNosotrosServicio.enviarNuevaDescripcionSobreNosotros(datosActualizados).subscribe({
          next: (respuesta) => {
            this.datosSobreNosotros = respuesta;
            Swal.fire({
              icon: 'success',
              text: 'Descripción actualizada correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              text: 'Error al actualizar la descripción',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  seleccionarImagen(idImagen: number): void {
    const imagenSeleccionada = this.datosSobreNosotros.imagenes.find(imagen => imagen.idImagen === idImagen);
    if (imagenSeleccionada) {
      this.idImagenSeleccionada = idImagen;
      this.urlImagenSeleccionada = imagenSeleccionada.url;
    }
  }

  alSeleccionarArchivo(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement)?.files?.[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          text: 'Solo se permiten imágenes.',
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }

      const lector = new FileReader();
      lector.readAsDataURL(archivo);
      lector.onload = () => {
        this.imagenSeleccionadaEnBase64 = lector.result!.toString().split(',')[1];
        this.nombreArchivoImagenSeleccionada = archivo.name;
        this.urlImagenSeleccionada = lector.result as string;
      };
    }
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
        this.obtenerDatosSobreNosotros(); // Vuelve a cargar los datos originales
      }
    });
  }

  cancelarActualizarImagen(): void {
    this.idImagenSeleccionada = null;
    this.urlImagenSeleccionada = '';
    this.imagenSeleccionadaEnBase64 = null;
    this.nombreArchivoImagenSeleccionada = '';
  }

  actualizarImagen(): void {
    if (this.idImagenSeleccionada === null || !this.imagenSeleccionadaEnBase64) {
      Swal.fire({
        icon: 'error',
        text: 'Selecciona una imagen válida.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la imagen seleccionada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const datosImagenActualizada: GaleriaModificarDTO = {
          idSobreNosotros: this.datosSobreNosotros.idSobreNosotros,
          idImagen: this.idImagenSeleccionada,
          imagen: this.imagenSeleccionadaEnBase64,
          nombreArchivo: this.nombreArchivoImagenSeleccionada
        };

        this.sobreNosotrosServicio.actualizarImagenGaleria(datosImagenActualizada).subscribe({
          next: (respuesta) => {
            this.datosSobreNosotros = respuesta;
            this.cancelarActualizarImagen();
            Swal.fire({
              icon: 'success',
              text: 'Imagen actualizada correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              text: 'Error al actualizar la imagen',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }
}