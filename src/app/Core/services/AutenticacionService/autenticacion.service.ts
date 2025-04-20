import { inject, Injectable } from '@angular/core';
import { TokenDeRespuestaDTO } from '../../models/TokenDeRespuestaDTO';
import { RespuestaAutenticacionDTO } from '../../models/RespuestaAutenticacionDTO';
import { AdministradorLoginDTO } from '../../models/AdministradorLoginDTO';
import { LocalStorageService } from '../LocalStorageService/local-storage.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  private localStorage = inject(LocalStorageService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private urlBase = "https://localhost:7169/api/Autenticacion";
  private keyIsAuth = "isAuthenticated";
  public keyStorage = "tokens";

  constructor() { }

  public Login = (login: AdministradorLoginDTO): Observable<RespuestaAutenticacionDTO> => {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/Login`, login).pipe(
      tap(respuesta => {
        //antes de restornar la respuesta verifica que sea valida y guarda los token en el storage
        if (respuesta.tokenDeRespuesta) {
          console.log('Respuesta de login:', respuesta);
          this.localStorage.setItem(this.keyStorage, respuesta.tokenDeRespuesta);
          this.localStorage.setItem(this.keyIsAuth, 'true');
        }
      })
    );
  }

  public RefreshToken = (): Observable<TokenDeRespuestaDTO> => {
    const tokens = this.localStorage.getItem<TokenDeRespuestaDTO>(this.keyStorage);
    const refreshToken = tokens?.tokenDeRefresco;
    return this.http.post<TokenDeRespuestaDTO>(`${this.urlBase}/RefreshToken`, {},{ headers: { Authorization: `Bearer ${refreshToken}` } });
  }

  public isAuthenticated = (): boolean => {
    return this.localStorage.getItem(this.keyIsAuth) === 'true';
  }

  public logout = (): void => {
    this.localStorage.clear();
    this.router.navigate(['login']);
  }

}
