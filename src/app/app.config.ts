import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { autorizacionInterceptor } from './Core/custom/AutorizacionJWT/autorizacion.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(), 
    provideHttpClient(withFetch(), withInterceptors([autorizacionInterceptor])), 
    provideAnimationsAsync(), 
    provideAnimationsAsync()
  ]
};


// provideRouter(routes, withComponentInputBinding()), dependecia requerida para el ruteo
// y este provideHttpClient(withFetch()) para las peticiones de los services