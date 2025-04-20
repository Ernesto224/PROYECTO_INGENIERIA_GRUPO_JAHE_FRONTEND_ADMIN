import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { HabitacionConsultaDTO } from '../../Core/models/HabitacionConsultaDTO';
import { TipoDeHabitacionDTO } from '../../Core/models/TipoDeHabitacionDTO';
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
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { HabitacionesService } from '../../Core/services/HabitacionesService/habitaciones.service';
import { TipoHabitacionesService } from '../../Core/services/TipoHabitacionesService/tipo-habitaciones.service';
import { PageEvent } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-consultar-disponibilidad-habitaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }, provideNativeDateAdapter()],
  templateUrl: './consultar-disponibilidad-habitaciones.component.html',
  styleUrl: './consultar-disponibilidad-habitaciones.component.css'
})
export class ConsultarDisponibilidadHabitacionesComponent implements OnInit {

  private tipoDeHabitacionesService = inject(TipoHabitacionesService);
  public listaTipoDeHabitaciones = signal<TipoDeHabitacionDTO[]>([]);
  private habitacionesService = inject(HabitacionesService);
  public listaHabitacionesConsulta = signal<HabitacionConsultaDTO[]>([]);

  public paginaActual = 1;
  public totalPaginas = 1;
  public maximoPorPagina = 5;
  public totalRegistros = 0;

  private formBuilder = inject(FormBuilder);
  public form: FormGroup;

  public displayedColumns: string[] = ['numerohabitacion', 'tipo', 'tarifaDiaria'];

  public hoy = new Date(); 
  
  constructor() {
    this.form = this.formBuilder.group({
      idTiposDeHabitacion: [[], Validators.required],
      fechaLlegada: ['', Validators.required],
      fechaSalida: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerTiposDeHabitaciones();
    this.obtenerDatosDeHabitacion();
  }

  //Obtienemos los tipos de habitaciones
  private obtenerTiposDeHabitaciones() {
    this.tipoDeHabitacionesService.obtenerTipoDeHabitaciones().subscribe({
      next: (respuesta: any) => {
        this.listaTipoDeHabitaciones.set(respuesta);
        // Preseleccionar todos
        const allIds = this.listaTipoDeHabitaciones().map(h => h.idTipoDeHabitacion);
        this.form.patchValue({ idTiposDeHabitacion: allIds });
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  private obtenerDatosDeHabitacion() {
    const parametrosConsulta = {
      idTiposHabitacion: this.form.value.idTiposDeHabitacion,
      fechaLlegada: this.form.value.fechaLlegada,
      fechaSalida: this.form.value.fechaSalida,
      numeroDePagina: this.paginaActual,
      maximoDeDatos: this.maximoPorPagina,
      irALaUltimaPagina: false
    };

    this.habitacionesService.consultaHabitacionesDisponibles(parametrosConsulta).subscribe({
      next: (respuesta: any) => {
        this.listaHabitacionesConsulta.set(respuesta.habitaciones);
        this.totalRegistros = respuesta.totalRegistros;
        this.totalPaginas = respuesta.totalPaginas;
        this.paginaActual = respuesta.paginaActual;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  public onPageChange(event: PageEvent) {
    this.paginaActual = event.pageIndex + 1;
    this.maximoPorPagina = event.pageSize;
    this.obtenerDatosDeHabitacion();
  }

  public consultar() {
    this.paginaActual = 1;
    this.obtenerDatosDeHabitacion();
  }

}
