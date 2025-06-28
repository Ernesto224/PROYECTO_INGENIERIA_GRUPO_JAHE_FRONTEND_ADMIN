import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PublicidadService } from '../../Core/services/PublicidadService/publicidad.service';
import { PublicidadDTO } from '../../Core/models/PublicidadDTO';
import { PublicidadCrearDTO } from '../../Core/models/PublicidadCrearDTO';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatPaginatorModule, FormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule, MatTableModule, MatIconModule],
  templateUrl: './publicidad.component.html',
  styleUrl: './publicidad.component.css'
})
export class PublicidadComponent implements OnInit {

  publicidadService = inject(PublicidadService);

  modoEdicion: boolean = false;
  publicidadActual: PublicidadDTO | null = null;

  //mat-table
  listaPublicidadesDataTable = new MatTableDataSource<PublicidadDTO>([]);
  displayedColumns: string[] = ['id', 'enlacePublicidad', 'imagen', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private fb = inject(FormBuilder);
  form: FormGroup;
  imagenBase64: string | null = null;
  nombreArchivo: string = '';
  imagenUrl: string = '';

  constructor() {
    this.form = this.fb.group({
      enlacePublicidad: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerPublicidades();
  }

  onFileSelected(event: any) {
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

  //Obtener todas las publicidades
  obtenerPublicidades() {
    this.publicidadService.obtenerPublicidades().subscribe(response => {
      this.setTable(response);
    });
  }

  //setear la tabla con los datos obtenidos
  setTable(data: PublicidadDTO[]) {
    this.listaPublicidadesDataTable = new MatTableDataSource<PublicidadDTO>(data);
    this.listaPublicidadesDataTable.paginator = this.paginator;
  }

  // Agregar publicidad 
  agregarNuevaPublicidad() {
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

    const publicidadData: PublicidadCrearDTO = {
      enlacePublicidad: this.form.value.enlacePublicidad,
      imagen: this.imagenBase64,
      nombreArchivo: this.nombreArchivo
    };

    if (this.modoEdicion && this.publicidadActual) {
      // Modo edición
      this.publicidadService.modificarPublicidad(publicidadData, this.publicidadActual.idPublicidad).subscribe(
        response => {
          Swal.fire({ icon: "success", text: "Publicidad actualizada!", showConfirmButton: false, timer: 1500 });
          this.resetFormulario();
          this.obtenerPublicidades();
        },
        error => {
          console.error(error);
          Swal.fire({ icon: "error", text: "Error al actualizar publicidad", showConfirmButton: false, timer: 1500 });
        }
      );
    } else {
      // Modo creación
      this.publicidadService.crearPublicidad(publicidadData).subscribe(
        response => {
          Swal.fire({ icon: "success", text: "Publicidad creada!", showConfirmButton: false, timer: 1500 });
          this.resetFormulario();
          this.obtenerPublicidades();
        },
        error => {
          console.error(error);
          Swal.fire({ icon: "error", text: "Error al crear publicidad", showConfirmButton: false, timer: 1500 });
        }
      );
    }
  }

  // Editar publicidad 
  editarPublicidad(publicidad: PublicidadDTO) {
    this.modoEdicion = true;
    this.publicidadActual = publicidad;
    this.imagenUrl = publicidad.imagen.url;
    this.nombreArchivo = 'Imagen existente';

    this.form.patchValue({
      enlacePublicidad: publicidad.enlacePublicidad
    });
  }

  resetFormulario() {
    this.modoEdicion = false;
    this.publicidadActual = null;
    this.form.reset({
      enlacePublicidad: '',
      imagen: null
    });
    this.imagenBase64 = null;
    this.nombreArchivo = '';
    this.imagenUrl = '';
  }

  // Eliminar publicidad
  eliminarPublicidad(idPublicidad: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la publicidad de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
        this.publicidadService.eliminarPublicidad(idPublicidad).subscribe({
          next: (respuesta: any) => {

            if (respuesta.esCorrecto == true) {
              Swal.fire({ icon: "success", text: respuesta.texto, showConfirmButton: false, timer: 1500 });
              this.obtenerPublicidades(); // Recargar la tabla
            } else {
              Swal.fire({ icon: "error", text: respuesta.texto, showConfirmButton: false, timer: 4000 });
            }

          },
          error: (err) => {
            console.error('Error al eliminar publicidad:', err);
            Swal.fire({ icon: "error", text: err, showConfirmButton: false, timer: 4000 });
          }
        });
      }
    });
  }

  //Cancelar acción
  cancelar() {
    // Reiniciar el formulario
    this.form.reset({
      nombre: '',
      imagen: null
    });

    // Limpiar las variables de imagen
    this.imagenBase64 = null;
    this.nombreArchivo = '';
    this.imagenUrl = '';
  }

}