import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ListadoReservacionesService } from '../../Core/services/ListadoReservacionesService/listado-reservaciones.service';
import { ReservacionDTO } from '../../Core/models/ReservacionDTO';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { RespuestaConsultaReservaDTO } from '../../Core/models/RespuestaConsultaReservaDTO ';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-reservaciones',
  standalone: true,
  templateUrl: './listado-reservaciones.component.html',
  styleUrls: ['./listado-reservaciones.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent },
    provideNativeDateAdapter()
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule
  ]
})
export class ListadoReservacionesComponent implements OnInit {
  private servicioReservaciones = inject(ListadoReservacionesService);
  private detectorCambos = inject(ChangeDetectorRef);
  public reservaciones = signal<ReservacionDTO[]>([]);
  public reservacion!: ReservacionDTO;
  public paginaActual = 1;
  public totalPaginas = 1;
  public maximoPorPagina = 5;
  public totalRegistros = 0;
  public verReservacion = false;

  public displayedColumns: string[] = [
    'fecha',
    'idReserva',
    'nombre',
    'apellidos',
    'email',
    'tarjeta',
    'transaccion',
    'fechaLlegada',
    'fechaSalida',
    'tipo',
    'ver',
    'eliminar'
  ];

  ngOnInit(): void {
    this.obtenerReservaciones();
  }

  private obtenerReservaciones(): void {
    const parametrosConsulta = {
      numeroDePagina: this.paginaActual,
      maximoDeDatos: this.maximoPorPagina,
      irALaUltimaPagina: false
    };
    this.servicioReservaciones.obtenerListadoReservaciones(parametrosConsulta).subscribe({
      next: (respuesta: RespuestaConsultaReservaDTO) => {
        this.reservaciones.set(respuesta.lista);
        this.totalRegistros = respuesta.totalRegistros;
        this.totalPaginas = respuesta.totalPaginas;
        this.paginaActual = respuesta.paginaActual;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  public verReservacionEspecifica(idReserva: string): void {
    this.servicioReservaciones.verReservacionEspecifica(idReserva).subscribe({
      next: (reservacion: ReservacionDTO) => {
        this.reservacion = reservacion;
        this.verReservacion = true;
        this.detectorCambos.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener reservación:', err);
      }
    });
  }

  public eliminarReservacion(idReserva: string): void {
    Swal.fire({
      text: '¿Estás seguro de que deseas eliminar esta reservación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((resultadoConfirmacion) => {
      if (resultadoConfirmacion.isConfirmed) {
        this.servicioReservaciones.eliminarReservacion(idReserva).subscribe({
          next: (resultado: boolean) => {
            if (resultado) {
              Swal.fire({
                icon: 'success',
                text: 'Reservación eliminada correctamente.',
                timer: 1500,
                showConfirmButton: false,
              });
              this.obtenerReservaciones();
            } else {
              Swal.fire({
                icon: 'error',
                text: 'No se pudo eliminar la reservación.',
                timer: 1500,
                showConfirmButton: false,
              });
            }
          },
          error: (error: any) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              text: 'Error al eliminar la reservación.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  }

  public onPageChange(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex + 1;
    this.maximoPorPagina = evento.pageSize;
    this.obtenerReservaciones();
  }

  public eliminarReserva(): void {
    if (!this.reservacion) return;
    this.eliminarReservacion(this.reservacion.idReserva);
    this.verReservacion = false;
  }

  public imprimirReserva(): void {
    if (!this.reservacion) return;
    const ventanaImprimir = window.open('', '_blank');
    if (ventanaImprimir) {
      ventanaImprimir.document.write('<html><head><title>Imprimir Reservación</title></head><body>');
      ventanaImprimir.document.write(`<pre>${JSON.stringify(this.reservacion, null, 2)}</pre>`);
      ventanaImprimir.document.write('</body></html>');
      ventanaImprimir.document.close();
      ventanaImprimir.print();
    }
  }

  public volver(): void {
    this.verReservacion = false;
  }
}
