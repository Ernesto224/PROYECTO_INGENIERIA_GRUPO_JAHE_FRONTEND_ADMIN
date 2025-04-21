import { Component, effect, inject, signal, computed } from '@angular/core';
import { SobreNosotrosService } from '../../Core/services/SobreNosotrosService/sobre-nosotros.service';
import { SobreNosotrosDTO } from '../../Core/models/SobreNosotrosDTO';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css',
})
export class SobreNosotrosComponent {
  private serviceSobreNosotros = inject(SobreNosotrosService);

  readonly sobreNosotros = signal<SobreNosotrosDTO>({
    idSobreNosotros: -1,
    descripcion: '',
    imagenes: [],
  });
  readonly sobreNosotrosActualizado = signal<SobreNosotrosDTO>({
    idSobreNosotros: -1,
    descripcion: '',
    imagenes: [],
  });

  readonly idImagenSeleccionada = signal<number>(-1);
  readonly urlImagenActualizada = signal<string>('');
  readonly descripcionControl = new FormControl('');

  readonly imagenSeleccionadaValida = computed(
    () => this.idImagenSeleccionada() !== -1 && this.urlImagenActualizada() !== ''
  );

  ngOnInit() {
    this.obtenerInformacion();
  }

  obtenerInformacion() {
    this.serviceSobreNosotros.obtenerDatosSobreNosotros().subscribe({
      next: (data) => {
        this.sobreNosotros.set(data);
        this.sobreNosotrosActualizado.set(data);
        this.descripcionControl.setValue(data.descripcion);
      },
      error: (error) => {
        console.error('Hubo un error al obtener la información', error);
      },
      complete: () => {
        console.log('Información obtenida con éxito.');
      },
    });
  }

  actualizarDescripcion() {
    const descripcionActualizada = this.descripcionControl.value ?? '';
    const sobreNosotrosActual = { ...this.sobreNosotros(), descripcion: descripcionActualizada };

    this.serviceSobreNosotros.enviarNuevaDescripcionSobreNosotros(sobreNosotrosActual).subscribe({
      next: (data) => {
        this.sobreNosotros.set(data);
      },
      error: (error) => {
        console.error('Error al actualizar la descripción', error);
      },
      complete: () => {
        console.log('Descripción actualizada correctamente.');
      },
    });
  }

  capturarImagenSeleccionada(idImagen: number) {
    const imagen = this.sobreNosotros().imagenes?.find((img) => img.idImagen === idImagen);
    if (imagen) {
      this.idImagenSeleccionada.set(idImagen);
      this.urlImagenActualizada.set(imagen.url);
      console.log('Imagen seleccionada:', idImagen);
    }
  }

  actualizarUrlImagen() {
    const imagenesActualizadas = this.sobreNosotrosActualizado().imagenes.map(img => {
      if (img.idImagen === this.idImagenSeleccionada()) {
        return { ...img, url: this.urlImagenActualizada() };
      }
      return img;
    });
    this.sobreNosotrosActualizado.set({ ...this.sobreNosotrosActualizado(), imagenes: imagenesActualizadas });
  }

  actualizarImagenGaleria() {
    const sobreNosotrosActualizado = { ...this.sobreNosotros() };
    this.serviceSobreNosotros.enviarNuevasImagenesGaleria(sobreNosotrosActualizado).subscribe({
      next: (data) => {
        this.sobreNosotros.set(data);
      },
      error: (error) => {
        console.error("Error al actualizar galeria", error);
      }
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      const url = URL.createObjectURL(file);
      this.urlImagenActualizada.set(url);
      console.log('Imagen nueva seleccionada:', file.name);
    }
  }
}
