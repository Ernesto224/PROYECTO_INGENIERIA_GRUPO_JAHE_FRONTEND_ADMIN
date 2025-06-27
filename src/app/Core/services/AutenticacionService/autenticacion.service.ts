import { inject, Injectable } from '@angular/core';
import { TokenDeRespuestaDTO } from '../../models/TokenDeRespuestaDTO';
import { RespuestaAutenticacionDTO } from '../../models/RespuestaAutenticacionDTO';
import { AdministradorLoginDTO } from '../../models/AdministradorLoginDTO';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SeguridadService } from '../SeguridadService/seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  private seguridad = inject(SeguridadService);
  private http = inject(HttpClient);
  private urlBase = "http://www.hotel-jade-api.somee.com/api/Autenticacion";

  constructor() { }

  public Login = (login: AdministradorLoginDTO): Observable<RespuestaAutenticacionDTO> => {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/Login`, login).pipe(
      tap(respuesta => {
        //antes de restornar la respuesta verifica que sea valida y guarda los token en el storage
        if (respuesta.tokenDeRespuesta) {
          console.log('Respuesta de login:', respuesta);
          this.seguridad.setToken(respuesta.tokenDeRespuesta);
          this.seguridad.autenticar();
        }
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

  public RefreshToken = (): Observable<TokenDeRespuestaDTO> => {
    const tokens = this.seguridad.getToken();
    const refreshToken = tokens?.tokenDeRefresco;
    return this.http.post<TokenDeRespuestaDTO>(`${this.urlBase}/RefreshToken`, {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
  }

}
