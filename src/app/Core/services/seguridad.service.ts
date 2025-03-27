import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { LoginResponse } from '../models/LogginResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private http = inject(HttpClient);
  private router = inject(Router); 
  private login_url = "http://gestordocumental.somee.com/api/Autenticación/login";


  constructor() { }





  //borrar cunado este listo el del hotel y usar el de abajo
  public logginPrueba(correo: string, password: string) {
    sessionStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('correo', correo);
  }

 
  
  public loggin(correo: string, password: string): Observable<any> {
    // Configurar los parámetros
    const params = new HttpParams().set('Correo', correo).set('Password', password);
  
    // Realizar la solicitud POST y capturar la respuesta y errores
    return this.http.post<LoginResponse>(this.login_url, null, { params }).pipe(
      tap(response => {
        console.log('Respuesta de login:', response);
  
        // Aquí puedes almacenar información en el localStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('correo', response.correo.toString());
      
        

      }),
      catchError(error => {
        // Captura el error aquí, por ejemplo, un error 404
        if (error.status === 404) {
          console.error('Error 404: Recurso no encontrado');
        } else {
          console.error('Error en la solicitud:', error);
        }
        // Re-lanza el error para que sea capturado en el componente
        return throwError(() => error);
      })
    );
    


  }




  
  isAuthenticated(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';// este atributo se borra automaticamente cuando el usuario sale de la pagina, asi que no tengo necesiadad de limpiarlo en el logout
  }



  logout(): void {
    localStorage.removeItem('correo');
    localStorage.removeItem('usuarioID');
    sessionStorage.removeItem('isAuthenticated');

    this.router.navigate(['login']);
  }






}
