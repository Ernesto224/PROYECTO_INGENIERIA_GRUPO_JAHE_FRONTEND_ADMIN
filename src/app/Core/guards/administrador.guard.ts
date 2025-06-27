import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/SeguridadService/seguridad.service';
import { inject } from '@angular/core';

export const administradorGuard: CanActivateFn = (route, state) => {

  const seguridad = inject(SeguridadService);
  const router = inject(Router);

  if (!seguridad.existeAutenticacion()) {
    return router.navigate(['login']);
  }

  return true;
};
