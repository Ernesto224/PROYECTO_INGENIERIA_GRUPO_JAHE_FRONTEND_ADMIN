import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { OfertaDTO } from '../../models/OfertaDTO';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { OfertaServiceService } from '../../services/OfertaService/oferta-service.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TipoDeHabitacionDTO } from '../../models/TipoDeHabitacionDTO';
import { TipoHabitacionesService } from '../../services/TipoHabitacionesService/tipo-habitaciones.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-modal-modificar-oferta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIcon, MatDatepickerModule
  ],
  providers: [{ provide: MatPaginatorIntl }, provideNativeDateAdapter()],
  templateUrl: './modal-modificar-oferta.component.html',
  styleUrl: './modal-modificar-oferta.component.css'
})
export class ModalModificarOfertaComponent implements OnChanges {

  @Input() oferta!: OfertaDTO;

  nombreArchivo: string = '';
  imagenBase64: string | null = null;
  imagenUrl: string = '';

  ofertaForm: FormGroup = new FormGroup({});

  listaTipoDeHabitaciones: TipoDeHabitacionDTO[] = [];

  constructor(private fb: FormBuilder,
    private ofertaService: OfertaServiceService,
    private tipoDeHabitacionService: TipoHabitacionesService
  ) { }

  ngOnInit(): void {
    this.obtenerTipoDeHabitacion();
    this.cargarDatosFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oferta'] && this.oferta) {
      this.cargarDatosFormulario();
    }
  }

  cargarDatosFormulario() {
    this.ofertaForm = this.fb.group({
      nombre: [this.oferta.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      fechaInicio: [this.oferta.fechaInicio, [Validators.required]],
      fechaFinal: [this.oferta.fechaFinal, [Validators.required]],
      porcentaje: [this.oferta.porcentaje, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipoDeHabitacion: [this.oferta.tipoDeHabitacion.idTipoDeHabitacion, [Validators.required]],
      imagen: [this.oferta.imagen, [Validators.required]]
    });
    this.imagenUrl = this.oferta.imagen.url;
  }


  @Output() cerrar = new EventEmitter<void>();

  guardarCambios() {

    if (this.ofertaForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Completa los campos requeridos!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    Swal.fire({
      text: '¿Deseas actualizar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const tipoId = this.ofertaForm.get('tipoDeHabitacion')?.value;
        const selectedTipo = this.listaTipoDeHabitaciones.find(t => t.idTipoDeHabitacion === tipoId);

        if (!selectedTipo) {
          return; // mostrar mensaje de advertencia
        }

        const ofertaModificada: any = {
          ofertaDTO: {
            idOferta: this.oferta.idOferta,
            nombre: this.ofertaForm.get('nombre')?.value,
            fechaInicio: this.ofertaForm.get('fechaInicio')?.value,
            fechaFinal: this.ofertaForm.get('fechaFinal')?.value,
            porcentaje: this.ofertaForm.get('porcentaje')?.value,
            activo: this.oferta.activo,
            tipoDeHabitacion: selectedTipo,
            imagen: {
              idImagen: this.oferta.imagen.idImagen,
              url: this.oferta.imagen.url
            }
          },
          imagen: this.imagenBase64,
          nombreArchivo: this.nombreArchivo
        };

        this.ofertaService.modificarOferta(ofertaModificada).subscribe({
          next: (respuesta: any) => {
            if (respuesta.esCorrecto == true) {
              Swal.fire({ icon: "success", text: "Modificacion completada exitosamente", showConfirmButton: false, timer: 1500 });
              this.cerrarFormulario();

            }
            else {
              Swal.fire({ icon: "error", text: respuesta.texto, showConfirmButton: false, timer: 4000 });
            }
          },
          error: (error: any) => {
            Swal.fire({ icon: "error", text: "Ocurrió un error al actualizar la oferta. " + error, showConfirmButton: false, timer: 4000 });
          }
        });
      }
    });
  }

  public onFileSelected(event: any): void {
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

  obtenerTipoDeHabitacion() {
    this.tipoDeHabitacionService.obtenerTipoDeHabitaciones().subscribe({
      next: (respuesta: TipoDeHabitacionDTO[]) => {
        this.listaTipoDeHabitaciones = respuesta;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  cerrarFormulario(): void {
    this.cerrar.emit();
  }

}
