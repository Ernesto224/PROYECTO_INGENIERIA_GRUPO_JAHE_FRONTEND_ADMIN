import { Component, inject, OnInit, signal } from '@angular/core';
import { ListadoReservacionesService } from '../../Core/services/ListadoReservacionesService/listado-reservaciones.service';
@Component({
  selector: 'app-listado-reservaciones',
  standalone: true,
  imports: [],
  templateUrl: './listado-reservaciones.component.html',
  styleUrl: './listado-reservaciones.component.css',
})
export class ListadoReservacionesComponent {
  private servicioReservaciones = inject(ListadoReservacionesService);
  readonly reservaciones = signal<any[] | null>([]);
  ngOnInit() {
    this.obtenerListaReservaciones();
  }
  obtenerListaReservaciones() {
    this.servicioReservaciones.obtenerListadoReservaciones().subscribe({
      next: (data) => {},
      error: (Error) => {
        console.error('Hubo un error al obtener la informacion');
      },
      complete: () => {
        console.log('Se obtuvieron los datos');
      },
    });
  }
  eliminarReservacion(idReservacion: number) {
    this.servicioReservaciones.eliminarReservacion(idReservacion).subscribe({
      next: (data) => {},
      error: (Error) => {
        console.error('Hubo un error al eliminar la reservacion');
      },
      complete: () => {
        console.log('Operacion completada');
      },
    });
  }
  verReservacionEspecifica(idReservacion: number) {
    this.servicioReservaciones.eliminarReservacion(idReservacion).subscribe({
      next: (data) => {},
      error: (Error) => {
        console.error('Hubo un error al eliminar la reservacion');
      },
      complete: () => {
        console.log('Operacion completada');
      },
    });
  }
}
