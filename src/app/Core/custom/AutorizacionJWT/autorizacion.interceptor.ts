import { inject } from '@angular/core';
import { TokenDeRespuestaDTO } from '../../models/TokenDeRespuestaDTO';
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../../services/LocalStorageService/local-storage.service';
import { AutenticacionService } from '../../services/AutenticacionService/autenticacion.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const autorizacionInterceptor: HttpInterceptorFn = (req, next) => {

  //se inyecta el servicio de storage para acceder a los token almacenados
  const authService = inject(AutenticacionService);
  const localStorage = inject(LocalStorageService);

  // El interceptor captura todas las solicitudes http que van a salir y provoca que estas pasen por el primero
  // de esta forma se puede agregar de forma globala el token de autorizacion a todas las solicitudes
  if (!req.headers?.get('auth')) {
    return next(req);
  }

  // Obtener tokens del almacenamiento
  const tokens = localStorage.getItem<TokenDeRespuestaDTO>(authService.keyStorage);

  if (!tokens?.tokenDeAcceso) {
    // Si no hay token de acceso, cerrar sesión
    authService.logout();
    return throwError(() => new Error('Token no encontrado'));
  }

  // Clonamos la request con el token de acceso
  const reqConToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokens.tokenDeAcceso}`
    }
  });

  return next(reqConToken).pipe(
    catchError((error: any) => {
      // Solo refrescar si falla por 401 y hay refresh token
      if (error.status === 401 && tokens?.tokenDeRefresco) {
        return authService.RefreshToken().pipe(
          switchMap(nuevoToken => {
            localStorage.setItem(authService.keyStorage, nuevoToken);
            const reqReintentada = req.clone({
              setHeaders: {
                Authorization: `Bearer ${nuevoToken.tokenDeAcceso}`
              }
            });
            return next(reqReintentada);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }      
      // Otro error (403, 500, etc.) → lanzar sin refrescar
      return throwError(() => error);
    })
  );

};
