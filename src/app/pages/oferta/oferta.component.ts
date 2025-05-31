import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OfertaDTO } from '../../Core/models/OfertaDTO';
import { OfertaServiceService } from '../../Core/services/OfertaService/oferta-service.service';
import { signal } from '@angular/core';
import { ModalModificarOfertaComponent } from '../../Core/custom/modal-modificar-oferta/modal-modificar-oferta.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatDatepickerModule,
    ModalModificarOfertaComponent],
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.css'
})
export class OfertaComponent {

  constructor(private ofertaService: OfertaServiceService) { }

  public displayedColumns: string[] = ['nombre', 'fechaInicio', 'fechaFin', 'porcentaje', 'tipoDeHabitacion', 'acciones', 'estado'];

  public paginaActual = 1;
  public totalPaginas = 1;
  public maximoPorPagina = 5;
  public totalRegistros = 0;

  public ofertasPaginadas = signal<OfertaDTO[]>([]);

  public modalModificarOferta: boolean = false;

  isLoading = true;

  public ofertaSeleccionada: OfertaDTO = {
    idOferta: 0,
    nombre: '',
    fechaInicio: new Date(),
    fechaFinal: new Date(),
    porcentaje: 0,
    activo: false,
    tipoDeHabitacion: {
      idTipoDeHabitacion: 0,
      nombre: '',
      descripcion: '',
      tarifaDiaria: 0,
      imagen: {
        idImagen: 0,
        url: '',
      }
    },
    imagen: {
      idImagen: 0,
      url: '',
    }
  }

  ngOnInit() {
    this.obtenerDatosOfertas();
  }

  public onPageChange(event: PageEvent) {
    this.paginaActual = event.pageIndex + 1;
    this.maximoPorPagina = event.pageSize;
    this.obtenerDatosOfertas();
  }

  private obtenerDatosOfertas() {

    this.isLoading = true;
    
    const parametrosConsulta = {
      numeroDePagina: this.paginaActual,
      maximoDeDatos: this.maximoPorPagina,
      irALaUltimaPagina: false
    };

    this.ofertaService.obtenerOfertasPaginadas(parametrosConsulta).subscribe({
      next: (respuesta: (any)) => {
        this.ofertasPaginadas.set(respuesta.lista);
        this.totalRegistros = respuesta.totalRegistros;
        this.totalPaginas = respuesta.totalPaginas;
        this.paginaActual = respuesta.paginaActual;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  onToggleActivo(idOferta: number) {

    const oferta = this.ofertasPaginadas().find(o => o.idOferta === idOferta);
    if (oferta) {
      oferta.activo = !oferta.activo;
      this.ofertaService.desactivarOferta(idOferta).subscribe({
        next: (respuesta: any) => {
          if (respuesta.esCorrecto == true) {
            Swal.fire({ icon: "success", text: respuesta.texto, showConfirmButton: false, timer: 1500 });

          }
          else {
            Swal.fire({ icon: "error", text: respuesta.texto, showConfirmButton: false, timer: 4000 });
          }
        },
        error: (error) => {
            
        }
      });
    }
  }

  abrirModalModificarOferta(oferta: OfertaDTO) {
    this.ofertaSeleccionada = oferta;
    this.modalModificarOferta = true;

  }

  cerrarFormularioModificar() {
    this.modalModificarOferta = false;
    this.obtenerDatosOfertas();
  }


}
