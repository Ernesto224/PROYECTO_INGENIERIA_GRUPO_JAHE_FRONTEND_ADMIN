import { inject, Injectable } from '@angular/core';
import { TipoDeHabitacionDTO } from '../../models/TipoDeHabitacionDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionesService {

  private http = inject(HttpClient);
  private urlBase = "https://localhost:7169/api/Tarifas";

  constructor() { }

  public obtenerTipoDeHabitaciones = () : Observable<TipoDeHabitacionDTO[]> => {
    return this.http.get<TipoDeHabitacionDTO[]>(this.urlBase);
  }

  public actualizarTipoHabitacion(tipoHabitacion: any) {
    return this.http.put('https://localhost:7169/api/Tarifas', tipoHabitacion, {headers: { auth: 'true' }});
  }

}
