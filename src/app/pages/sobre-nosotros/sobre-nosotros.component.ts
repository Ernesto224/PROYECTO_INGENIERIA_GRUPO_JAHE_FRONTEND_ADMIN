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
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sobreNosotrosService = inject(SobreNosotrosService);

  form: FormGroup;
  sobreNosotros!: SobreNosotrosDTO;
  imagenSeleccionadaId: number | null = null;
  imagenUrl: string = '';
  imagenBase64: string | null = null;
  nombreArchivo: string = '';

  constructor() {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerInformacion();
  }
  cancelar(){
    
  }
  obtenerInformacion() {
    this.sobreNosotrosService.obtenerDatosSobreNosotros().subscribe({
      next: (data) => {
        this.sobreNosotros = data;
        console.log(this.sobreNosotros);
        this.form.patchValue({ descripcion: data.descripcion });
      },
      error: (err) => {
        console.error('Error al obtener información:', err);
      }
    });
  }

  actualizarDescripcion() {
    if (this.form.invalid) {
      Swal.fire({ icon: 'error', text: 'La descripción es requerida.', timer: 1500, showConfirmButton: false });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la descripción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const actualizado: SobreNosotrosDTO = {
          ...this.sobreNosotros,
          descripcion: this.form.value.descripcion
        };

        this.sobreNosotrosService.enviarNuevaDescripcionSobreNosotros(actualizado).subscribe({
          next: (data) => {
            this.sobreNosotros = data;
            Swal.fire({ icon: 'success', text: 'Descripción actualizada.', timer: 1500, showConfirmButton: false });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({ icon: 'error', text: 'Error al actualizar.', timer: 1500, showConfirmButton: false });
          }
        });
      }
    });
  }

  seleccionarImagen(id: number) {
    const imagen = this.sobreNosotros.imagenes.find(img => img.idImagen === id);
    if (imagen) {
      this.imagenSeleccionadaId = id;
      this.imagenUrl = imagen.url;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagenBase64 = reader.result!.toString().split(',')[1];
        this.nombreArchivo = file.name;
        this.imagenUrl = reader.result as string;
      };
    }
  }

  actualizarImagen() {
    if (!this.imagenSeleccionadaId || !this.imagenBase64) {
      Swal.fire({ icon: 'error', text: 'Selecciona una imagen válida.', timer: 1500, showConfirmButton: false });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar la imagen seleccionada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const imagenesActualizadas = this.sobreNosotros.imagenes.map(img =>
          img.idImagen === this.imagenSeleccionadaId
            ? { ...img, url: this.imagenUrl }
            : img
        );

        const actualizado: SobreNosotrosDTO = {
          ...this.sobreNosotros,
          imagenes: imagenesActualizadas
        };

        this.sobreNosotrosService.enviarNuevasImagenesGaleria(actualizado).subscribe({
          next: (data) => {
            this.sobreNosotros = data;
            Swal.fire({ icon: 'success', text: 'Imagen actualizada.', timer: 1500, showConfirmButton: false });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({ icon: 'error', text: 'Error al actualizar imagen.', timer: 1500, showConfirmButton: false });
          }
        });
      }
    });
  }
}
