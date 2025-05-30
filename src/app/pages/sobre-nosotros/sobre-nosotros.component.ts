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
      descripcion: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerDatosSobreNosotros();
  }

  obtenerDatosSobreNosotros() {
    this.sobreNosotrosServicio.obtenerDatosSobreNosotros().subscribe({
      next: (respuesta) => {
        this.datosSobreNosotros = respuesta;
        console.log(respuesta);
        this.formularioSobreNosotros.patchValue({ descripcion: respuesta.descripcion });
      },
      error: (error) => {
        console.error('Error al obtener información:', error);
      }
    });
  }

  actualizarDescripcion() {
    if (this.formularioSobreNosotros.invalid) {
      Swal.fire({ icon: 'error', text: 'La descripción es requerida.', timer: 1500, showConfirmButton: false });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la descripción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(resultado => {
      if (resultado.isConfirmed) {
        const datosActualizados: SobreNosotrosDTO = {
          ...this.datosSobreNosotros,
          descripcion: this.formularioSobreNosotros.value.descripcion
        };

        this.sobreNosotrosServicio.enviarNuevaDescripcionSobreNosotros(datosActualizados).subscribe({
          next: (respuesta) => {
            this.datosSobreNosotros = respuesta;
            console.log(this.datosSobreNosotros.idSobreNosotros);
            Swal.fire({ icon: 'success', text: 'Descripción actualizada.', timer: 1500, showConfirmButton: false });
          },
          error: (error) => {
            console.error(error);
            Swal.fire({ icon: 'error', text: 'Error al actualizar.', timer: 1500, showConfirmButton: false });
          }
        });
      }
    });
  }

  seleccionarImagen(idImagen: number) {
    const imagenSeleccionada = this.datosSobreNosotros.imagenes.find(imagen => imagen.idImagen === idImagen);
    if (imagenSeleccionada) {
      this.idImagenSeleccionada = idImagen;
      this.urlImagenSeleccionada = imagenSeleccionada.url;
    }
  }

  alSeleccionarArchivo(evento: Event) {
    const archivo = (evento.target as HTMLInputElement)?.files?.[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        Swal.fire({ icon: 'error', text: 'Solo se permiten imágenes.', timer: 1500, showConfirmButton: false });
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

  cancelar() {
    // Lógica pendiente a implementar
  }

  actualizarImagen() {
    if (this.idImagenSeleccionada === null || !this.imagenSeleccionadaEnBase64) {
      Swal.fire({ icon: 'error', text: 'Selecciona una imagen válida.', timer: 1500, showConfirmButton: false });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la imagen seleccionada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(resultado => {
      if (resultado.isConfirmed) {
        console.log("VALOR DEL ID: "+this.datosSobreNosotros.idSobreNosotros);
        const datosImagenActualizada: GaleriaModificarDTO = {
          idSobreNosotros: this.datosSobreNosotros.idSobreNosotros,
          idImagen: this.idImagenSeleccionada,
          imagen: this.imagenSeleccionadaEnBase64,
          nombreArchivo: this.nombreArchivoImagenSeleccionada
        };

        this.sobreNosotrosServicio.actualizarImagenGaleria(datosImagenActualizada).subscribe({
          next: (respuesta) => {
            this.datosSobreNosotros = respuesta;
            Swal.fire({ icon: 'success', text: 'Imagen actualizada.', timer: 1500, showConfirmButton: false });
          },
          error: (error) => {
            console.error(error);
            Swal.fire({ icon: 'error', text: 'Error al actualizar imagen.', timer: 1500, showConfirmButton: false });
          }
        });
      }
    });
  }
}
