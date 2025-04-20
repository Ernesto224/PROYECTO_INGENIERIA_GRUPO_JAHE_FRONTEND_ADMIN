import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';
import { AutenticacionService } from '../services/AutenticacionService/autenticacion.service';
import { inject } from '@angular/core';

export const administradorGuard: CanActivateFn = (route, state) => {

  const seguridadService = inject(SeguridadService);
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  /*if (!seguridadService.isAuthenticated()) {
    return router.navigate(['login']);
  }*/
  if (!autenticacionService.isAuthenticated()) {
    return router.navigate(['login']);
  }

  return true;
};
