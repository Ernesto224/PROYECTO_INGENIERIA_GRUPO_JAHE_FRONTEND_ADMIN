import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { signal } from '@angular/core';
import { HabitacionesService } from '../../Core/services/HabitacionesService/habitaciones.service';
import { HabitacionDTO } from '../../Core/models/HabitacionDTO';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';




@Component({
  selector: 'app-ver-estado-hotel-hoy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatDatepickerModule],
  templateUrl: './ver-estado-hotel-hoy.component.html',
  styleUrl: './ver-estado-hotel-hoy.component.css'
})
export class VerEstadoHotelHoyComponent implements OnInit {

  ngOnInit(): void {
    this.obtenerDatosHabitacionesHoy();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public listaHabitacionesConsulta = signal<HabitacionDTO[]>([]);

  public datosCompletosParaPDF = signal<HabitacionDTO[]>([]);



  private formBuilder = inject(FormBuilder);
  public form: FormGroup;

  public displayedColumns: string[] = ['numerohabitacion', 'tipo', 'estado'];


  public fechaActual = new Date();
  public fechaSiguiente = new Date(this.fechaActual);

  constructor(private habitacionesService: HabitacionesService) {
    this.fechaSiguiente.setDate(this.fechaActual.getDate() + 1)
    this.form = this.formBuilder.group({
      idTiposDeHabitacion: [[], Validators.required],
      fechaLlegada: [this.fechaActual, Validators.required],
      fechaSalida: [this.fechaSiguiente, Validators.required]
    });
  }

  public paginaActual = 1;
  public totalPaginas = 1;
  public maximoPorPagina = 5;
  public totalRegistros = 0;

  public onPageChange(event: PageEvent) {
    this.paginaActual = event.pageIndex + 1;
    this.maximoPorPagina = event.pageSize;
    this.obtenerDatosHabitacionesHoy();
  }


  private obtenerDatosHabitacionesHoy() {
    const parametrosConsulta = {
      numeroDePagina: this.paginaActual,
      maximoDeDatos: this.maximoPorPagina,
      irALaUltimaPagina: false
    };

    this.habitacionesService.consultarHabitacionesHoy(parametrosConsulta).subscribe({
      next: (respuesta: any) => {
        this.listaHabitacionesConsulta.set(respuesta.lista);
        this.totalRegistros = respuesta.totalRegistros;
        this.totalPaginas = respuesta.totalPaginas;
        this.paginaActual = respuesta.paginaActual;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  obtenerDatosParaPDF(): Promise<void> {
    const parametrosConsulta = {
      numeroDePagina: 1,
      maximoDeDatos: 100,
      irALaUltimaPagina: false
    };



    return new Promise((resolve, reject) => {
      try {
        this.habitacionesService.consultarHabitacionesHoy(parametrosConsulta).subscribe({
          next: (respuesta: any) => {
            resolve();
            this.datosCompletosParaPDF.set(respuesta.lista);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  refrescarDatos(): void {
    this.paginaActual = 1;
    this.obtenerDatosHabitacionesHoy();
  }


  async generarPDF(): Promise<void> {

    await this.obtenerDatosParaPDF();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text(`Estado del Hotel - ${fecha}`, 14, 15);

    const datosTabla = this.datosCompletosParaPDF().map(habitacion => [
      habitacion.numero,
      habitacion.tipoDeHabitacion.nombre,
      this.obtenerEstadoTexto(habitacion.estado)
    ]);

    autoTable(doc, {
      head: [['Número', 'Tipo de Habitación', 'Estado']],
      body: datosTabla,
      startY: 20,
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

  private obtenerEstadoTexto(estado: string): string {
    switch (estado) {
      case 'OCUPADA': return 'Ocupada';
      case 'NO_DISP': return 'No Disponible';
      case 'RESERVADA': return 'Reservada';
      case 'DISPONIBLE': return 'Disponible';
      default: return estado;
    }
  }


}
