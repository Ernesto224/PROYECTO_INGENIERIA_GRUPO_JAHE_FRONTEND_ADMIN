import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PublicidadService } from '../../Core/services/PublicidadService/publicidad.service';
import { PublicidadDTO } from '../../Core/models/PublicidadDTO';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  //mat-table
  listaPublicidadesDataTable = new MatTableDataSource<PublicidadDTO>([]);
  displayedColumns: string[] = ['id', 'enlacePublicidad','imagen', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.obtenerPublicidades(); 
  }

  //Obtener todas las publicidades
  obtenerPublicidades(){
    this.publicidadService.obtenerPublicidades().subscribe(response => {
      this.setTable(response);
    });
  }

  //setear la tabla con los datos obtenidos
  setTable(data:PublicidadDTO[]){
    this.listaPublicidadesDataTable = new MatTableDataSource<PublicidadDTO>(data);
    this.listaPublicidadesDataTable.paginator = this.paginator;
  }
  
  // Agregar publicidad 
  agregarNuevaPublicidad() {
    console.log('Agregar publicidad:');
  }

  // Editar publicidad 
  editarPublicidad(publicidad: PublicidadDTO) {
    console.log('Editar publicidad:', publicidad);
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
            }else {
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
    console.log('Cancelar');
  }

}