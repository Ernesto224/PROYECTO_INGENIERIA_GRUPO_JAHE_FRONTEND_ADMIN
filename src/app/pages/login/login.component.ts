import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeguridadService } from '../../Core/services/seguridad.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  router = inject(Router);
  seguridadService = inject(SeguridadService);

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    user: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });




  
  //borrar cunado este listo el del hotel y usar el de abajo
  logginPrueba(): void {

    if (this.formulario.invalid) {
      this.mostrarErrores();
      return;
    }
    this.seguridadService.logginPrueba(this.formulario.value.user!, this.formulario.value.password!);
    this.inicioSesionCorrecto();
  }




  loggin(): void {

    if (this.formulario.invalid) {
      this.mostrarErrores();
      return;
    }

    this.seguridadService.loggin(this.formulario.value.user!, this.formulario.value.password!)
    .subscribe(
      response => {

        console.log(response);
        this.inicioSesionCorrecto();
       
      },
      error => {
        if (error.status === 404) {
          console.log("error");
          this.errorLoggin();
        } else {
          alert('Ocurrió un error inesperado en el inicio de sesión.');
        }
      }
    );
    
  }



  inicioSesionCorrecto(): void {
    this.router.navigate(['inicio']);  
  }



  
  mostrarErrores(): void{

    // Obtener elemento del DOM
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
      
    // Construir mensaje de error
    let mensajeError = '';
    
    if (this.formulario.controls.user.errors) {
      if (this.formulario.controls.user.errors['required']) {
        mensajeError += 'El usuario es requerido<br>';
      }
      if (this.formulario.controls.user.errors['email']) {
        mensajeError += 'El formato del email es inválido<br>';
      }
    }
    
    if (this.formulario.controls.password.errors?.['required']) {
      mensajeError += 'La contraseña es requerida<br>';
    }
    
    // Mostrar mensaje
    if (mensajeDiv) {
      mensajeDiv.innerHTML = mensajeError;
      mensajeDiv.style.color = 'rgb(89, 94, 110)';

    }
    
    return;
  }



  errorLoggin():void {
    console.error('Error al iniciar');
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
    if (mensajeDiv) {
      mensajeDiv.innerHTML = 'Credenciales incorrectas.';
      mensajeDiv.style.color = 'rgb(89, 94, 110)';   
    }
  }




}
