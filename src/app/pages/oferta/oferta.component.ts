import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
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
import Swal from 'sweetalert2';
import { TipoDeHabitacionDTO } from '../../Core/models/TipoDeHabitacionDTO';
import { MatIcon } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';




@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatDatepickerModule,
    FormsModule,
    MatIcon],
  providers: [{ provide: MatPaginatorIntl }, provideNativeDateAdapter()],
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.css'
})
export class OfertaComponent {

  constructor(private ofertaService: OfertaServiceService,
    private tipoHabitacionService: TipoHabitacionesService,
    private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      porcentaje: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      tipoDeHabitacion: ['', Validators.required],
      imagen: ['', this.modoEdicion ? null : Validators.required]
    });
  }

  public displayedColumns: string[] = ['nombre', 'fechaInicio', 'fechaFin', 'porcentaje', 'tipoDeHabitacion', 'acciones', 'estado'];

  public paginaActual = 1;
  public totalPaginas = 1;
  public maximoPorPagina = 5;
  public totalRegistros = 0;

  public ofertasPaginadas = signal<OfertaDTO[]>([]);

  public modalModificarOferta: boolean = false;

  isLoading = true;

  ofertaForm: FormGroup;
  modoEdicion: boolean = false;
  ofertaActual: OfertaDTO | null = null;
  listaTipoDeHabitaciones: TipoDeHabitacionDTO[] = [];
  imagenBase64: string | null = null;
  imagenUrl: string | null = null;
  nombreArchivo: string = '';

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
    this.obtenerTipoDeHabitacion();
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

  // abrirModalModificarOferta(oferta: OfertaDTO) {
  //   this.ofertaSeleccionada = oferta;
  //   this.modalModificarOferta = true;
  // }


  // cerrarFormularioModificar() {
  //   this.modalModificarOferta = false;
  //   this.obtenerDatosOfertas();
  // }

  editarOferta(oferta: OfertaDTO) {
    this.modoEdicion = true;
    this.ofertaActual = oferta;
    this.imagenUrl = oferta.imagen.url;

    this.ofertaForm.patchValue({
      nombre: oferta.nombre,
      fechaInicio: oferta.fechaInicio,
      fechaFinal: oferta.fechaFinal,
      porcentaje: oferta.porcentaje,
      tipoDeHabitacion: oferta.tipoDeHabitacion.idTipoDeHabitacion
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nombreArchivo = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagenBase64 = (reader.result as string).split(',')[1];
        this.imagenUrl = reader.result as string;
      };
    }
  }

  guardarCambios() {
    if (this.ofertaForm.invalid) {
      Swal.fire('Error', 'Completa todos los campos requeridos', 'error');
      return;
    }

    const tipoId = this.ofertaForm.get('tipoDeHabitacion')?.value;
    const selectedTipo = this.listaTipoDeHabitaciones.find(t => t.idTipoDeHabitacion === tipoId);

    if (!selectedTipo) {
      Swal.fire('Error', 'Selecciona un tipo de habitación válido', 'error');
      return;
    }

    const ofertaData: any = {
      ofertaDTO: {
        idOferta: this.modoEdicion && this.ofertaActual ? this.ofertaActual.idOferta : 0,
        nombre: this.ofertaForm.get('nombre')?.value,
        fechaInicio: this.ofertaForm.get('fechaInicio')?.value,
        fechaFinal: this.ofertaForm.get('fechaFinal')?.value,
        porcentaje: this.ofertaForm.get('porcentaje')?.value,
        activo: this.modoEdicion && this.ofertaActual ? this.ofertaActual.activo : true,
        tipoDeHabitacion: selectedTipo,
        imagen: {
          idImagen: this.modoEdicion && this.ofertaActual ? this.ofertaActual.imagen.idImagen : 0,
          url: this.modoEdicion && this.ofertaActual ? this.ofertaActual.imagen.url : ''
        }
      },
      imagen: this.imagenBase64,
      nombreArchivo: this.nombreArchivo
    };

    const servicioObservable = this.modoEdicion
      ? this.ofertaService.modificarOferta(ofertaData)
      : this.ofertaService.crearOferta(ofertaData);

    servicioObservable.subscribe({
      next: (respuesta: any) => {
        if (respuesta.esCorrecto) {
          Swal.fire('Éxito', respuesta.texto, 'success');
          this.resetFormulario();
          this.obtenerDatosOfertas();
        } else {
          Swal.fire('Error', respuesta.texto, 'error');
        }
      },
      error: (error) => {
        Swal.fire('Error', 'Operación fallida: ' + error.message, 'error');
      }
    });
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.modoEdicion = false;
    this.ofertaActual = null;
    this.ofertaForm.reset();
    this.imagenBase64 = null;
    this.imagenUrl = null;
    this.nombreArchivo = '';
  }


  obtenerTipoDeHabitacion() {
    this.tipoHabitacionService.obtenerTipoDeHabitaciones().subscribe({
      next: (respuesta: TipoDeHabitacionDTO[]) => {
        this.listaTipoDeHabitaciones = respuesta;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }


}
