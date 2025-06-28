import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModificarDTO } from '../../Core/models/HomeModificarDTO';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HomeService } from '../../Core/services/HomeService/home.service';
import { ExpresionesRegulares } from '../../Core/validators/regex.validators';
import Swal from 'sweetalert2';
import { HomeDTO } from '../../Core/models/HomeDTO';

@Component({
  selector: 'app-inicio-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIcon],
  templateUrl: './inicio-clientes.component.html',
  styleUrl: './inicio-clientes.component.css'
})
export class InicioClientesComponent implements OnInit {

  ngOnInit(): void {
    this.obtenerDatosHome();
  }

  constructor() {
    this.form = this.fb.group({
      idHome: [null, Validators.required],
      descripcion: ['', [Validators.required]],
      imagen: [null]
    });
  }

  private homeService = inject(HomeService);

  private fb = inject(FormBuilder);
  form: FormGroup;
  imagenBase64: string | null = null;
  nombreArchivo: string = '';
  imagenUrl: string = '';


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

  public obtenerDatosHome(): void {
    this.homeService.obtenerDatosHome().subscribe({
      next: (respuesta: any) => {

        console.log('Datos obtenidos:', respuesta);
        this.form.patchValue({
          idHome: respuesta.idHome,
          descripcion: respuesta.descripcion
        });

        this.imagenUrl = respuesta.imagen.url;
        console.log('Imagen URL:', this.imagenUrl);

      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      }
    });
  }

  public actualizar(): void {
    if (this.form.invalid) {
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

        const homeModificarDTO: HomeModificarDTO = {
          idHome: this.form.value.idHome,
          descripcion: this.form.value.descripcion,
          imagen: this.imagenBase64,
          nombreArchivo: this.nombreArchivo
        };

        this.homeService.actualizarHome(homeModificarDTO).subscribe({
          next: (respuesta: any) => {
            console.log('Respuesta del servidor:', respuesta);
            if (respuesta.EsCorrecto = true) {
              Swal.fire({ icon: "success", text: respuesta.texto, showConfirmButton: false, timer: 1500 });
            } else {
              Swal.fire({ icon: "error", text: respuesta.texto, showConfirmButton: false, timer: 1500 });
            }
          },
          error: (error: any) => {
            Swal.fire({ icon: "error", text: error.message, showConfirmButton: false, timer: 3000 });
          }
        });

      }
    });
  }

  public cancelar(): void {
    Swal.fire({
      text: '¿Deseas cancelar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#F7374F',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.obtenerDatosHome(); // Vuelve a cargar los datos originales
        this.imagenBase64 = null;
        this.nombreArchivo = '';
        // No necesitamos resetear imagenUrl porque obtenerDatosHome() la actualizará
      }
    });
  }

}
