import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../Core/services/AutenticacionService/autenticacion.service';
import { AdministradorLoginDTO } from '../../Core/models/AdministradorLoginDTO';
import { ExpresionesRegulares } from '../../Core/validators/regex.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  router = inject(Router);
  private autenticacionService = inject(AutenticacionService);

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    user: ['', [Validators.required, Validators.pattern(ExpresionesRegulares.email)]],
    password: ['', [Validators.required, Validators.pattern(ExpresionesRegulares.passwordSegura)]]
  });

  public logginJWT = (): void => {

    if (this.formulario.invalid) {
      this.mostrarErrores();
      return;
    }

    const login: AdministradorLoginDTO = {
      nombreDeUsuario: this.formulario.value.user!,
      contrasennia: this.formulario.value.password!
    }

    this.autenticacionService.Login(login).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta);
        this.inicioSesionCorrecto();
      },
      error: (error: any) => {
        if (error.status === 404) {
          console.log("error");
          this.errorLoggin();
        } else {
          alert('Ocurrió un error inesperado en el inicio de sesión.');
        }
      }
    });
    
  }

  inicioSesionCorrecto(): void {
    this.router.navigate(['inicio']);
  }

  mostrarErrores(): void {

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

  errorLoggin(): void {
    console.error('Error al iniciar');
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
    if (mensajeDiv) {
      mensajeDiv.innerHTML = 'Credenciales incorrectas.';
      mensajeDiv.style.color = 'rgb(89, 94, 110)';
    }
  }

}
