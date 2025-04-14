import { Component, inject, OnInit } from '@angular/core';
import { TipoHabitacionesService } from '../../Core/services/TipoHabitacionesService/tipo-habitaciones.service';
import { TipoDeHabitacionDTO } from '../../Core/models/TipoDeHabitacionDTO';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TipoDeHabitacionActualizarDTO } from '../../Core/models/TipoDeHabitacionModificarDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-tipo-habitacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule, MatIcon],
  templateUrl: './modificar-tipo-habitacion.component.html',
  styleUrl: './modificar-tipo-habitacion.component.css'
})
export class ModificarTipoHabitacionComponent implements OnInit {

  tipoDeHabitacionesService = inject(TipoHabitacionesService);
  listaTipoDeHabitaciones! : TipoDeHabitacionDTO[];

  private fb = inject(FormBuilder);
  form: FormGroup;
  imagenBase64: string | null = null;
  nombreArchivo: string = '';
  imagenUrl: string = '';

  constructor() {
    this.form = this.fb.group({
      idTipoDeHabitacion: [null, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tarifaDiaria: [0, [Validators.required, Validators.min(0)]],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerTiposDeHabitaciones();
  }

  obtenerTiposDeHabitaciones(){
    this.tipoDeHabitacionesService.obtenerTipoDeHabitaciones().subscribe(response => {
      this.listaTipoDeHabitaciones = response;
    });
  }

  onSelectHabitacion(id: number) {
    const habitacion = this.listaTipoDeHabitaciones.find(h => h.idTipoDeHabitacion === id);
    if (habitacion) {
      this.form.patchValue({
        idTipoDeHabitacion: habitacion.idTipoDeHabitacion,
        nombre: habitacion.nombre,
        descripcion: habitacion.descripcion,
        tarifaDiaria: habitacion.tarifaDiaria
      });
      this.imagenUrl = habitacion.imagen.url;
    }
  }

  onFileSelected(event: any) {
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


  actualizar() {

    if(this.form.invalid){

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

        const TipoDeHabitacionActualizarDTO: TipoDeHabitacionActualizarDTO = {
          idTipoDeHabitacion: this.form.value.idTipoDeHabitacion,
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          tarifaDiaria: this.form.value.tarifaDiaria,
          imagen: this.imagenBase64,
          nombreArchivo: this.nombreArchivo
        };
    
        console.log(TipoDeHabitacionActualizarDTO);
      
        this.tipoDeHabitacionesService.actualizarTipoHabitacion(TipoDeHabitacionActualizarDTO).subscribe(
          response => {
            Swal.fire({icon: "success", text: "Actualización exitosa!", showConfirmButton: false, timer: 1500});
            this.obtenerTiposDeHabitaciones(); // Recargar la lista después de actualizar
          }, 
          error => {
            console.error(error);
            Swal.fire({icon: "error", text: "Ocurrió un error al actualizar la habitación.", showConfirmButton: false, timer: 1500});
          }
        );

      }
    });

    
  }


  cancelar() {
    // Reiniciar el formulario
    this.form.reset({
      idTipoDeHabitacion: null,
      nombre: '',
      descripcion: '',
      tarifaDiaria: 0,
      imagen: null
    });
    
    // Limpiar las variables de imagen
    this.imagenBase64 = null;
    this.nombreArchivo = '';
    this.imagenUrl = '';
  }


}