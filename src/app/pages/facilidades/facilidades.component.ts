import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilidadDTO } from '../../Core/models/FacilidadDTO';
import { FacilidadModificarDTO } from '../../Core/models/FacilidadModificarDTO';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FacilidadesService } from '../../Core/services/FacilidadesService/facilidades.service';
import { ExpresionesRegulares } from '../../Core/validators/regex.validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facilidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIcon],
  templateUrl: './facilidades.component.html',
  styleUrl: './facilidades.component.css'
})
export class FacilidadesComponent implements OnInit {

  private facilidadesService = inject(FacilidadesService);
  public listaFacilidades: FacilidadDTO[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;
  imagenBase64: string | null = null;
  nombreArchivo: string = '';
  imagenUrl: string = '';

  constructor() {
    this.form = this.fb.group({
      idFacilidad: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.pattern(ExpresionesRegulares.descripciones)]],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerFacilidades();
  }

  private obtenerFacilidades(): void {
    this.facilidadesService.obtenerFacilidades().subscribe(response => {
      this.listaFacilidades = response;
    });
  }

  public onSelectFacilidad(id: number): void {
    const facilidad = this.listaFacilidades.find(f => f.idFacilidad === id);
    if (facilidad) {
      this.form.patchValue({
        idFacilidad: facilidad.idFacilidad,
        descripcion: facilidad.descripcion,
      });
      this.imagenUrl = facilidad.imagen.url;
    }
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
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

  public actualizar(): void {
    if (this.form.invalid) {
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
      text: '¿Deseas actualizar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const FacilidadModificarDTO: FacilidadModificarDTO = {
          idFacilidad: this.form.value.idFacilidad,
          descripcion: this.form.value.descripcion,
          imagen: this.imagenBase64,
          nombreArchivo: this.nombreArchivo
        };

        console.log(FacilidadModificarDTO);

        this.facilidadesService.actualizarFacilidad(FacilidadModificarDTO).subscribe({
          next: (respuesta: any) => {
            Swal.fire({ icon: respuesta.icon, text: respuesta.text, showConfirmButton: false, timer: 1500 });
            this.obtenerFacilidades(); // Recargar la lista después de actualizar
          },
          error: (error: any) => {
            console.error(error);
            Swal.fire({ icon: "error", text: "Ocurrió un error al actualizar la habitación.", showConfirmButton: false, timer: 1500 });
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
        this.resetearFormulario(); // Vuelve a cargar los datos originales
      }
    });
  }

  private resetearFormulario(): void {
    this.form.reset({
      idFacilidad: null,
      descripcion: '',
      imagen: null
    });
    this.imagenBase64 = null;
    this.nombreArchivo = '';
    this.imagenUrl = '';
  }

}
