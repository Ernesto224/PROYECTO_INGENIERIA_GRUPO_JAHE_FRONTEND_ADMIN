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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    MatListModule,
    MatDialogModule
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
  public mostrarTabla = true; // Nueva propiedad para controlar la visibilidad de la tabla

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
        this.mostrarTabla = false; // Ocultar tabla al mostrar detalles
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
    this.volver();
  }

  refrescarDatos(): void {
    this.paginaActual = 1;
    this.obtenerReservaciones();
  }

  public generarPDF(): void {
    if (!this.reservacion) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const fechaActual = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text(`Detalle de Reservación - ${fechaActual}`, 14, 15);

    const body = [
      ['ID Reserva', this.reservacion.idReserva],
      ['Nombre', this.reservacion.nombre],
      ['Apellidos', this.reservacion.apellidos],
      ['Email', this.reservacion.email],
      ['Número de Tarjeta', this.reservacion.tarjeta],
      ['ID Transacción', this.reservacion.transaccion],
      ['Fecha de Llegada', new Date(this.reservacion.fechaLlegada).toLocaleDateString()],
      ['Fecha de Salida', new Date(this.reservacion.fechaSalida).toLocaleDateString()],
      ['Tipo de Habitación', this.reservacion.tipo],
      ['Fecha de Registro', new Date(this.reservacion.fecha).toLocaleDateString()]
    ];

    autoTable(doc, {
      head: [['Campo', 'Valor']],
      body,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  public volver(): void {
    this.verReservacion = false;
    this.mostrarTabla = true; // Mostrar tabla al volver
    this.detectorCambos.detectChanges();
  }
}