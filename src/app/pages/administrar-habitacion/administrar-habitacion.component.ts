import { Component, inject, OnInit } from '@angular/core';
import { EstadoHabitacionService } from '../../Core/services/EstadoHabitacionService/estado-habitacion.service';
import { EstadoHabitacionDTO } from '../../Core/models/EstadoHabitacionDTO';
import { TipoHabitacionesService } from '../../Core/services/TipoHabitacionesService/tipo-habitaciones.service';
import { TipoDeHabitacionDTO } from '../../Core/models/TipoDeHabitacionDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { EstadoHabitacionModificarDTO } from '../../Core/models/EstadoHabitacionModificarDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrar-habitacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, FormsModule, MatInputModule, MatSelectModule,MatButtonModule, MatSlideToggleModule, MatTableModule],
  templateUrl: './administrar-habitacion.component.html',
  styleUrl: './administrar-habitacion.component.css'
})
export class AdministrarHabitacionComponent implements OnInit  {

  estadoHabitacionService = inject(EstadoHabitacionService);
  listaHabitaciones! : EstadoHabitacionDTO[];
  listaHabitacionesFiltradas!: EstadoHabitacionDTO[];
  tipoDeHabitacionesService = inject(TipoHabitacionesService);
  listaTipoDeHabitaciones! : TipoDeHabitacionDTO[];

  estadoSwitch: { [idHabitacion: number]: boolean } = {};


  ngOnInit(): void {
    this.obtenerHabitaciones(); 
    this.obtenerTiposDeHabitaciones(); 
  }

  //Obtenemos las habitaciones
  obtenerHabitaciones (){
    this.estadoHabitacionService.obtenerHabitaciones().subscribe(response => {
      this.listaHabitaciones = response;
    });
  }

  //Obtienemos los tipos de habitaciones
  obtenerTiposDeHabitaciones(){
    this.tipoDeHabitacionesService.obtenerTipoDeHabitaciones().subscribe(response => {
      this.listaTipoDeHabitaciones = response;
    });
  }

  //Cargar solo las habitaciones segun el tipo de habiatacion seleccionada
  onSelectTipoHabitacion(id: number) {
    this.listaHabitacionesFiltradas = this.listaHabitaciones.filter(h => h.tipoDeHabitacion.idTipoDeHabitacion === id);
    console.log(this.listaHabitacionesFiltradas);

    // Mapear el estado booleano del switch según el estado de la habitación
    this.listaHabitacionesFiltradas.forEach(h => {
      this.estadoSwitch[h.idHabitacion] = this.esEstadoActivo(h.estado);
    });
    
  }

  //Devuelve true si el estado es "DISPONIBLE", "RESERVADA" u "OCUPADA" sino devuelve false
  esEstadoActivo(estado: string): boolean {
    const estadoUpper = estado.toUpperCase();
    return estadoUpper === 'DISPONIBLE' || estadoUpper === 'RESERVADA' || estadoUpper === 'OCUPADA';
  }

  //Captura cuando se cambia el switch y se realiza la peticion al servicio para cambiar el estado de la habitacion
  onToggleDisponibilidad(idHabitacion: number, estadoBoolean: boolean) {
    const estadoNuevo = estadoBoolean ? 'DISPONIBLE' : 'NO_DISP';
    const estadoAnterior = !estadoBoolean; // revertir el valor booleano
 
    const EstadoHabitacionModificar: EstadoHabitacionModificarDTO = {
      idHabitacion: idHabitacion,
      nuevoEstado: estadoNuevo
    };
  
    this.estadoHabitacionService.actualizarEstadoHabitacion(EstadoHabitacionModificar).subscribe({
      next: (respuesta) => {
        if (respuesta.exitoso) {
          Swal.fire({icon: "success", text: respuesta.mensaje, showConfirmButton: false, timer: 1500});
        } else {
          this.estadoSwitch[idHabitacion] = estadoAnterior;
          Swal.fire({icon: "error", text: respuesta.mensaje, showConfirmButton: false, timer: 1500});
        }
      },
      error: (error) => {
        Swal.fire({icon: "error", text: error, showConfirmButton: false, timer: 1500});
        this.estadoSwitch[idHabitacion] = estadoAnterior;
      }
    });
  
  }



}